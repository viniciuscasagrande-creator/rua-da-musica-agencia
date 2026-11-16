import React, { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from './components/layout/TopNavbar';
import { OperatorDashboard } from './components/operator_panel/OperatorDashboard';
import { AgencyPortal } from './components/agency_portal/AgencyPortal';
import { ProducerDashboard } from './components/producer_panel/ProducerDashboard';
import { VoucherModal } from './components/common/VoucherModal';
import { AccessHub } from './components/auth/AccessHub';
import {
  AGENCIES_LIST,
  BOOKINGS_LIST,
  SALES_TEAM_LIST,
  COMMISSION_LEDGER_ENTRIES,
  AGENCY_USERS_LIST
} from './data/mockData';

const VALID_PATHS = ['/', '/agencia', '/operador', '/produtor', '/admin'];

function normalizePath(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  return VALID_PATHS.includes(clean.toLowerCase()) ? clean.toLowerCase() : '/';
}

function getRequiredRoleForPath(path) {
  if (path === '/agencia') return 'AGENCIA';
  if (path === '/operador') return 'OPERADOR';
  if (path === '/produtor') return 'PRODUTOR';
  if (path === '/admin') return 'ADMIN';
  return null;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem('pdt_b2b_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activeSurface, setActiveSurface] = useState('agency'); // 'operator' | 'agency' | 'producer'
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);

  const [agencies, setAgencies] = useState(AGENCIES_LIST);
  const [bookings, setBookings] = useState(BOOKINGS_LIST);
  const [salesTeam, setSalesTeam] = useState(SALES_TEAM_LIST);
  const [commissionLedger, setCommissionLedger] = useState(COMMISSION_LEDGER_ENTRIES);
  const [agencyUsers, setAgencyUsers] = useState(AGENCY_USERS_LIST);
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    loading: true,
    database: 'Conectando ao Neon PostgreSQL...'
  });
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      surface: 'agency',
      bookingId: 'RES-B2B-1049',
      title: 'Voucher B2B emitido: RES-B2B-1049',
      description: 'Excursão Colégio Positivo (45 pax) liberada para check-in na catraca.',
      time: 'Há 12 min',
      unread: true,
      type: 'voucher'
    },
    {
      id: 'notif-2',
      surface: 'operator',
      bookingId: 'RES-B2B-1046',
      title: 'Pré-reserva aguardando confirmação',
      description: 'Viva Viagens (RES-B2B-1046 • 50 ingressos) expira em 24h.',
      time: 'Há 38 min',
      unread: true,
      type: 'booking'
    },
    {
      id: 'notif-3',
      surface: 'producer',
      title: 'Meta atingida na Equipe de Vendas',
      description: 'Promoter João Silva atingiu 94% da meta (312 ingressos vendidos).',
      time: 'Há 1 hora',
      unread: true,
      type: 'commission'
    }
  ]);

  const navigateTo = useCallback((nextPath) => {
    const normalized = normalizePath(nextPath);
    if (typeof window !== 'undefined' && window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Synchronize activeSurface with current route & role permissions
  useEffect(() => {
    if (!session) return;
    if (session.role === 'AGENCIA') {
      setActiveSurface('agency');
    } else if (session.role === 'OPERADOR') {
      setActiveSurface('operator');
    } else if (session.role === 'PRODUTOR') {
      setActiveSurface('producer');
    }
  }, [session, currentPath]);

  const buildAuthHeaders = useCallback(
    (extra = {}) => {
      const headers = { ...extra };
      if (session?.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
        headers['x-b2b-session'] = session.token;
      }
      if (session?.role) {
        headers['x-b2b-role'] = session.role;
      }
      if (session?.agencyId) {
        headers['x-b2b-agency-id'] = session.agencyId;
      }
      return headers;
    },
    [session]
  );

  const handleLoginSuccess = useCallback(
    (newSession) => {
      setSession(newSession);
      try {
        sessionStorage.setItem('pdt_b2b_session', JSON.stringify(newSession));
      } catch {
        // Ignore storage errors
      }
      if (newSession.role === 'AGENCIA') {
        setActiveSurface('agency');
        navigateTo('/agencia');
      } else if (newSession.role === 'OPERADOR') {
        setActiveSurface('operator');
        navigateTo('/operador');
      } else if (newSession.role === 'PRODUTOR') {
        setActiveSurface('producer');
        navigateTo('/produtor');
      } else {
        setActiveSurface('operator');
        navigateTo('/admin');
      }
    },
    [navigateTo]
  );

  const handleLogout = useCallback(() => {
    setSession(null);
    try {
      sessionStorage.removeItem('pdt_b2b_session');
    } catch {
      // Ignore
    }
    navigateTo('/');
  }, [navigateTo]);

  const handleSurfaceChange = useCallback(
    (nextSurface) => {
      // Only ADMIN can switch between all 3 surfaces freely
      if (session?.role === 'ADMIN') {
        setActiveSurface(nextSurface);
      }
    },
    [session]
  );

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
      if (item.surface && session?.role === 'ADMIN') {
        setActiveSurface(item.surface);
      }
      if (item.bookingId) {
        const found = bookings.find((b) => b.id === item.bookingId);
        if (found) setSelectedVoucherBooking(found);
      }
    },
    [bookings, session]
  );

  const syncFromDatabase = useCallback(async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/b2b', {
        headers: buildAuthHeaders()
      });
      if (!res.ok) throw new Error('Falha ao consultar API B2B');
      const data = await res.json();
      if (data.connected) {
        if (Array.isArray(data.agencies) && data.agencies.length > 0) setAgencies(data.agencies);
        if (Array.isArray(data.bookings) && data.bookings.length > 0) setBookings(data.bookings);
        if (Array.isArray(data.salesTeam) && data.salesTeam.length > 0) setSalesTeam(data.salesTeam);
        if (Array.isArray(data.commissionLedger) && data.commissionLedger.length > 0) {
          setCommissionLedger(data.commissionLedger);
        }
        if (Array.isArray(data.agencyUsers) && data.agencyUsers.length > 0) {
          setAgencyUsers((prev) => {
            const ids = new Set(data.agencyUsers.map((u) => u.id));
            return [...data.agencyUsers, ...prev.filter((u) => !ids.has(u.id))];
          });
        }
        setDbStatus({
          connected: true,
          loading: false,
          database: data.database || 'disk_operational (Neon PostgreSQL)'
        });
      }
    } catch {
      setDbStatus({
        connected: false,
        loading: false,
        database: 'Modo Local (Fallback PDT)'
      });
    }
  }, [buildAuthHeaders]);

  useEffect(() => {
    syncFromDatabase();
  }, [syncFromDatabase]);

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
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action: 'create_agency', ...newAgency })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state if offline
    }
  };

  const handleCreateAgencyUser = async (newUser) => {
    setAgencyUsers((prev) => [...prev, newUser]);
    pushNotification({
      surface: 'agency',
      title: `Novo Usuário da Agência: ${newUser.name}`,
      description: `${newUser.roleTitle} vinculado exclusivamente a ${newUser.agencyName} (${newUser.agencyId}).`,
      type: 'booking'
    });
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action: 'create_agency_user', user: newUser })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state
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
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
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
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
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
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
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
      (ce) =>
        ce.kind === 'REVERSAL' &&
        (ce.reversesEntryId === originalId || ce.label?.includes(originalId))
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
      description: `Reversão de R$ ${Math.abs(Number(orig.amount || 0))
        .toFixed(2)
        .replace('.', ',')} ref. ${orig.id} (${orig.promoterName}).`,
      type: 'commission'
    });

    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action: 'create_commission_reversal', originalId })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic reversal if offline
    }
  };

  // Determine if current route requires Central de Acessos / Login screen
  const requiredRole = getRequiredRoleForPath(currentPath);
  const isAuthorizedForCurrentPath =
    currentPath !== '/' &&
    session &&
    (session.role === 'ADMIN' || session.role === requiredRole);

  if (!isAuthorizedForCurrentPath) {
    return (
      <AccessHub
        currentPath={currentPath}
        onNavigate={navigateTo}
        onLoginSuccess={handleLoginSuccess}
        agencyUsers={agencyUsers}
        agencies={agencies}
      />
    );
  }

  // Filter notifications by environment permission
  const visibleNotifications =
    session.role === 'ADMIN'
      ? notifications
      : notifications.filter((n) => n.surface === activeSurface);

  // Determine effective surface to render based on RBAC
  const effectiveSurface =
    session.role === 'ADMIN'
      ? activeSurface
      : session.role === 'AGENCIA'
      ? 'agency'
      : session.role === 'OPERADOR'
      ? 'operator'
      : 'producer';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <TopNavbar
        activeSurface={effectiveSurface}
        onSurfaceChange={handleSurfaceChange}
        session={session}
        onLogout={handleLogout}
        dbStatus={dbStatus}
        onRefreshDb={syncFromDatabase}
        notifications={visibleNotifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />

      {effectiveSurface === 'operator' && (
        <OperatorDashboard
          agencies={agencies}
          bookings={bookings}
          onCreateAgency={handleCreateAgency}
          onCheckinVoucher={handleCheckinVoucher}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {effectiveSurface === 'agency' && (
        <AgencyPortal
          bookings={bookings}
          agencies={agencies}
          agencyUsers={agencyUsers}
          session={session}
          onCreateBooking={handleCreateBooking}
          onCreateAgencyUser={handleCreateAgencyUser}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {effectiveSurface === 'producer' && (
        <ProducerDashboard
          agencies={agencies}
          salesTeam={salesTeam}
          commissionLedger={commissionLedger}
          onCreateSalesAgent={handleCreateSalesAgent}
          onReverseCommission={handleReverseCommission}
        />
      )}

      {selectedVoucherBooking && (
        <VoucherModal
          booking={selectedVoucherBooking}
          hideDiskFee={effectiveSurface === 'agency'}
          onCheckin={
            session.role === 'OPERADOR' || session.role === 'ADMIN'
              ? handleCheckinVoucher
              : undefined
          }
          onClose={() => setSelectedVoucherBooking(null)}
        />
      )}
    </div>
  );
}
