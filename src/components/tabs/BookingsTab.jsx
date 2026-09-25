import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  Search,
  Filter,
  Eye,
  QrCode,
  CheckCircle,
  Clock,
  ChevronDown,
  UserCheck,
  Building2
} from 'lucide-react';
import { BOOKINGS_LIST } from '../../data/mockData';

export const BookingsTab = ({ onOpenVoucher }) => {
  const [bookings, setBookings] = useState(BOOKINGS_LIST);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/b2b/reservations')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setBookings(res.data);
        }
      })
      .catch(err => console.warn('[PDT] Could not fetch operator reservations:', err));
  }, []);

  const filtered = bookings.filter(b => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Voucher emitido':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Voucher emitido</span>;
      case 'Confirmado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmado</span>;
      case 'Concluído':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">Concluído</span>;
      case 'Pré-reservado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pré-reservado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Reservas de Grupos & Excursões B2B</h3>
          <p className="text-xs text-slate-500">Fluxo unificado: da pré-reserva da agência ao check-in na catraca do parque</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar reserva, agência ou grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pré-reservado">Pré-reservado</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Voucher emitido">Voucher emitido</option>
              <option value="Concluído">Concluído</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-5">Código</th>
              <th className="py-3 px-4">Agência Parceira</th>
              <th className="py-3 px-4">Grupo / Identificação</th>
              <th className="py-3 px-4">Data & Horário</th>
              <th className="py-3 px-4 text-center">Visitantes</th>
              <th className="py-3 px-4 text-right">Valor Total B2B</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                  {item.id}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {item.agencyName}
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  <div>{item.groupName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.guideName}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="font-medium text-slate-800">{item.visitDate}</div>
                  <div className="text-[11px] text-slate-400">{item.visitTime}</div>
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                  {item.ticketsCount} pax
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="font-bold text-slate-900">
                    R$ {item.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Taxa Disk: R$ {item.diskFeeAmount.toFixed(2)}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => onOpenVoucher(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver Voucher</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
