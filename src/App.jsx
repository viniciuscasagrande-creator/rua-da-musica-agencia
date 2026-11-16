import React, { useState, useEffect, useCallback } from 'react';
import { AccessGate } from './AccessGate';
import { AdminUsers } from './AdminUsers';
import { TopNavbar } from './components/layout/TopNavbar';
import { OperatorDashboard } from './components/operator_panel/OperatorDashboard';
import { AgencyPortal } from './components/agency_portal/AgencyPortal';
import { ProducerDashboard } from './components/producer_panel/ProducerDashboard';
import { VoucherModal } from './components/common/VoucherModal';
import {
  AGENCIES_LIST,
  BOOKINGS_LIST,
  SALES_TEAM_LIST,
  COMMISSION_LEDGER_ENTRIES
} from './data/mockData';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUsersOpen, setAdminUsersOpen] = useState(false);
  const [selectedAdminAgencyId, setSelectedAdminAgencyId] = useState('');
  const [activeSurface, setActiveSurface] = useState('agency');
  const setPermittedSurface = (surface) => {
    if (session?.user.role !== 'admin' && session?.user.role !== surface) return;
    setAdminUsersOpen(false); setActiveSurface(surface);
  };
  const logout = () => { sessionStorage.removeItem('portal_session'); setSession(null); history.pushState({}, '', '/'); };
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);

  const [agencies, setAgencies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [salesTeam, setSalesTeam] = useState([]);
  const [commissionLedger, setCommissionLedger] = useState([]);
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    loading: true,
    database: 'Conectando ao Neon PostgreSQL...'
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('portal_session');
    if (!saved) { setAuthLoading(false); return; }
    try {
      const stored = JSON.parse(saved);
      fetch('/api/auth', { headers: { Authorization: `Bearer ${stored.token}` } })
        .then(r => { if (!r.ok) throw new Error('Sessão expirada'); return r.json(); })
        .then(d => { setSession({ token: stored.token, user: d.user }); setActiveSurface(d.user.role === 'admin' ? 'operator' : d.user.role); })
        .catch(() => sessionStorage.removeItem('portal_session'))
        .finally(() => setAuthLoading(false));
    } catch { sessionStorage.removeItem('portal_session'); setAuthLoading(false); }
  }, []);
  const login = (data) => {
    sessionStorage.setItem('portal_session', JSON.stringify(data));
    setSession(data); setActiveSurface(data.user.role === 'admin' ? 'operator' : data.user.role);
  };

  const pushNotification = useCallback((notif) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        time: 'Agora mesmo',
        unread: true,
        ...notif
      },
      ...prev
    ]);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleNotificationClick = useCallback(
    (item) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );
      if (item.surface) {
        setPermittedSurface(item.surface);
      }
      if (item.bookingId) {
        const found = bookings.find((b) => b.id === item.bookingId);
        if (found) setSelectedVoucherBooking(found);
      }
    },
    [bookings]
  );

  const syncFromDatabase = useCallback(async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      if (!session?.token) return;
      const res = await fetch('/api/b2b', { headers: { Authorization: `Bearer ${session.token}` } });
      if (!res.ok) throw new Error('Falha ao consultar API B2B');
      const data = await res.json();
      if (data.connected) {
        if (Array.isArray(data.agencies)) setAgencies(data.agencies);
        if (Array.isArray(data.bookings)) setBookings(data.bookings);
        if (Array.isArray(data.salesTeam)) setSalesTeam(data.salesTeam);
        if (Array.isArray(data.commissionLedger)) {
          setCommissionLedger(data.commissionLedger);
        }
        setDbStatus({
          connected: true,
          loading: false,
          database: data.database || 'disk_operational (Neon PostgreSQL)'
        });
      }
    } catch (err) {
      setDbStatus({
        connected: false,
        loading: false,
        database: 'Erro na conexão — sem dados de demonstração'
      });
    }
  }, [session?.token]);

  useEffect(() => {
    if (session?.token) syncFromDatabase();
  }, [syncFromDatabase, session?.token]);

  const handleCreateAgency = async (newAgency) => {
    setAgencies((prev) => [newAgency, ...prev]);
    pushNotification({
      surface: 'operator',
      title: `Nova Agência Credenciada: ${newAgency.name}`,
      description: `${newAgency.cityUf} • Cota mensal: ${newAgency.quotaLimit} ingressos.`,
      type: 'booking'
    });
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ action: 'create_agency', ...newAgency })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state if offline
    }
  };

  const handleCreateBooking = async (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    pushNotification({
      surface: 'agency',
      bookingId: newBooking.id,
      title: `Reserva B2B Emitida: ${newBooking.id}`,
      description: `${newBooking.groupName} (${newBooking.ticketsCount} ingressos) para ${newBooking.visitDate}.`,
      type: 'voucher'
    });
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ action: 'create_reservation', booking: newBooking })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state if offline
    }
  };

  const handleCheckinVoucher = async (bookingId, checkedIn) => {
    const newStatus = checkedIn ? 'Concluído' : 'Voucher emitido';
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    setSelectedVoucherBooking((prev) =>
      prev && prev.id === bookingId ? { ...prev, status: newStatus } : prev
    );
    pushNotification({
      surface: 'operator',
      bookingId,
      title: checkedIn
        ? `Check-in Validado na Catraca: ${bookingId}`
        : `Check-in Reaberto: ${bookingId}`,
      description: `Status atualizado para "${newStatus}" no estoque único do Parque.`,
      type: 'voucher'
    });
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ action: 'checkin_voucher', bookingId, checkedIn })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state
    }
  };

  const handleCreateSalesAgent = async (member) => {
    setSalesTeam((prev) => [member, ...prev]);
    pushNotification({
      surface: 'producer',
      title: `Novo ${member.role} na Equipe: ${member.name}`,
      description: `Link #${member.linkCode} e cupom ${member.couponCode} ativos.`,
      type: 'commission'
    });
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ action: 'create_sales_agent', member })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state
    }
  };

  const handleReverseCommission = async (originalId) => {
    const orig = commissionLedger.find((ce) => ce.id === originalId);
    const alreadyReversed = commissionLedger.some(
      (ce) => ce.kind === 'REVERSAL' && (ce.reversesEntryId === originalId || ce.label?.includes(originalId))
    );
    if (!orig || orig.kind !== 'ACCRUAL' || alreadyReversed) return;

    const optimisticReversal = {
      id: `CE-${String(Date.now()).slice(-5)}`,
      orderId: orig.orderId,
      promoterName: orig.promoterName,
      kind: 'REVERSAL',
      label: `ESTORNO DE PEDIDO (Reversão Append-Only ref. ${orig.id})`,
      ticketType: `${orig.ticketType} (Estornado)`,
      amount: -Math.abs(Number(orig.amount || 0)),
      status: 'Revertido',
      reversesEntryId: orig.id,
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setCommissionLedger((prev) => [optimisticReversal, ...prev]);
    pushNotification({
      surface: 'producer',
      title: `Estorno Append-Only Registrado (${optimisticReversal.id})`,
      description: `Reversão de R$ ${Math.abs(Number(orig.amount || 0)).toFixed(2).replace('.', ',')} ref. ${orig.id} (${orig.promoterName}).`,
      type: 'commission'
    });

    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ action: 'create_commission_reversal', originalId })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic reversal if offline
    }
  };

  if (authLoading) return <div className="p-12 text-center">Validando sessão...</div>;
  if (!session) return <AccessGate onLogin={login} />;
  const agency = session.user.role === 'admin' ? (agencies.find(a => a.id === selectedAdminAgencyId) || agencies[0]) : agencies.find(a => a.id === session.user.agencyId);
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <div className="bg-slate-950 text-white px-5 py-2 text-xs flex flex-wrap gap-3 items-center justify-end">
        <span>{session.user.name} • {session.user.role === 'agency' ? agency?.name || session.user.agencyId : session.user.role}</span>
        {session.user.role === 'admin' && <button onClick={() => setAdminUsersOpen(v=>!v)} className="font-semibold underline">{adminUsersOpen ? 'Voltar ao painel' : 'Gerenciar usuários'}</button>}
        {session.user.role === 'admin' && activeSurface === 'agency' && <label>Visualizar agência: <select className="bg-slate-800 text-white rounded px-2 py-1 ml-1" value={agency?.id || ''} onChange={e => setSelectedAdminAgencyId(e.target.value)}>{agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>}
        <button onClick={logout} className="font-semibold underline">Sair</button>
      </div>
      <TopNavbar
        activeSurface={activeSurface}
        onSurfaceChange={setPermittedSurface}
        isAdmin={session.user.role === 'admin'}
        dbStatus={dbStatus}
        onRefreshDb={syncFromDatabase}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />

      {!adminUsersOpen && activeSurface === 'operator' && (
        <OperatorDashboard
          agencies={agencies}
          bookings={bookings}
          onCreateAgency={handleCreateAgency}
          onCheckinVoucher={handleCheckinVoucher}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {!adminUsersOpen && activeSurface === 'agency' && (
        <AgencyPortal
          agency={agency}
          bookings={bookings}
          onCreateBooking={handleCreateBooking}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {!adminUsersOpen && activeSurface === 'producer' && (
        <ProducerDashboard
          agencies={agencies}
          salesTeam={salesTeam}
          commissionLedger={commissionLedger}
          onCreateSalesAgent={handleCreateSalesAgent}
          onReverseCommission={handleReverseCommission}
        />
      )}

      {adminUsersOpen && session.user.role === 'admin' && <AdminUsers token={session.token} agencies={agencies} />}
      {selectedVoucherBooking && (
        <VoucherModal
          booking={selectedVoucherBooking}
          hideDiskFee={activeSurface === 'agency'}
          onCheckin={handleCheckinVoucher}
          onClose={() => setSelectedVoucherBooking(null)}
        />
      )}
    </div>
  );
}
