import React, { useState, useEffect, useCallback } from 'react';
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
  const [activeSurface, setActiveSurface] = useState('agency'); // 'operator' | 'agency' | 'producer'
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);

  const [agencies, setAgencies] = useState(AGENCIES_LIST);
  const [bookings, setBookings] = useState(BOOKINGS_LIST);
  const [salesTeam, setSalesTeam] = useState(SALES_TEAM_LIST);
  const [commissionLedger, setCommissionLedger] = useState(COMMISSION_LEDGER_ENTRIES);
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    loading: true,
    database: 'Conectando ao Neon PostgreSQL...'
  });

  const syncFromDatabase = useCallback(async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/b2b');
      if (!res.ok) throw new Error('Falha ao consultar API B2B');
      const data = await res.json();
      if (data.connected) {
        if (Array.isArray(data.agencies) && data.agencies.length > 0) setAgencies(data.agencies);
        if (Array.isArray(data.bookings) && data.bookings.length > 0) setBookings(data.bookings);
        if (Array.isArray(data.salesTeam) && data.salesTeam.length > 0) setSalesTeam(data.salesTeam);
        if (Array.isArray(data.commissionLedger) && data.commissionLedger.length > 0) {
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
        database: 'Modo Local (Fallback PDT)'
      });
    }
  }, []);

  useEffect(() => {
    syncFromDatabase();
  }, [syncFromDatabase]);

  const handleCreateAgency = async (newAgency) => {
    setAgencies((prev) => [newAgency, ...prev]);
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_agency', ...newAgency })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state if offline
    }
  };

  const handleCreateBooking = async (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkin_voucher', bookingId, checkedIn })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state
    }
  };

  const handleCreateSalesAgent = async (member) => {
    setSalesTeam((prev) => [member, ...prev]);
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_sales_agent', member })
      });
      await syncFromDatabase();
    } catch {
      // Keeps optimistic state
    }
  };

  const handleReverseCommission = async (originalId) => {
    try {
      await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_commission_reversal', originalId })
      });
      await syncFromDatabase();
    } catch {
      // Ignore error if offline
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <TopNavbar
        activeSurface={activeSurface}
        onSurfaceChange={setActiveSurface}
        dbStatus={dbStatus}
        onRefreshDb={syncFromDatabase}
      />

      {activeSurface === 'operator' && (
        <OperatorDashboard
          agencies={agencies}
          bookings={bookings}
          onCreateAgency={handleCreateAgency}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {activeSurface === 'agency' && (
        <AgencyPortal
          bookings={bookings}
          onCreateBooking={handleCreateBooking}
          onOpenVoucher={(booking) => setSelectedVoucherBooking(booking)}
        />
      )}

      {activeSurface === 'producer' && (
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
          onCheckin={handleCheckinVoucher}
          onClose={() => setSelectedVoucherBooking(null)}
        />
      )}
    </div>
  );
}
