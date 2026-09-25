import React, { useState } from 'react';
import {
  QrCode,
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import {
  AGENCY_SALES_VS_ACCESS_DATA,
  REAL_TIME_GATE_ACCESS_LOGS
} from '../../data/mockData';

export const AccessTab = () => {
  const [selectedAgency, setSelectedAgency] = useState(AGENCY_SALES_VS_ACCESS_DATA[0]);
  const [filterGate, setFilterGate] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = REAL_TIME_GATE_ACCESS_LOGS.filter(log => {
    const matchesGate = filterGate === 'ALL' || log.gate.includes(filterGate);
    const matchesSearch = log.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.attendeeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGate && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Validação de Ingressos & Catracas • Parque Jaime Lerner</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Controle de Acessos por Agência
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Acompanhe não apenas os ingressos vendidos, mas quantos visitantes <strong>efetivamente acessaram o parque</strong> por cada agência parceira em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Taxa Média de Utilização</span>
            <span className="text-base font-black text-emerald-600">82,4% de Comparecimento</span>
          </div>
        </div>
      </div>

      {/* Row 1: Agency Access Scorecard Focus */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 rounded-2xl p-6 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-black text-white">{selectedAgency.name}</h3>
              <span className="text-xs text-slate-400">{selectedAgency.city} - {selectedAgency.state} • Canal B2B Credenciado</span>
            </div>
          </div>

          {/* Quick Agency Switcher */}
          <div className="flex items-center gap-1.5">
            {AGENCY_SALES_VS_ACCESS_DATA.map(ag => (
              <button
                key={ag.id}
                onClick={() => setSelectedAgency(ag)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAgency.id === ag.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ag.name.replace('Agência ', '').split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Access Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Ingressos Vendidos</span>
            <span className="text-xl font-black text-white">{selectedAgency.ticketsSold.toLocaleString('pt-BR')}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Ingressos Utilizados</span>
            <span className="text-xl font-black text-emerald-400">{selectedAgency.ticketsUsed.toLocaleString('pt-BR')}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Não Utilizados</span>
            <span className="text-xl font-black text-amber-400">{selectedAgency.ticketsUnused}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Taxa de Utilização</span>
            <span className="text-xl font-black text-blue-400">{selectedAgency.utilizationRate}%</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Receita Gerada</span>
            <span className="text-xl font-black text-slate-100">R$ {(selectedAgency.revenue / 1000).toFixed(0)} mil</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Comissão Agência</span>
            <span className="text-xl font-black text-emerald-400">R$ {(selectedAgency.commissionAmount / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Recent Accesses for this specific agency */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Últimos Acessos Validados nas Catracas ({selectedAgency.name}):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {selectedAgency.accessLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-slate-850 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-slate-400">{log.time}</span>
                    <span className="font-bold text-blue-300">{log.ticketId}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate max-w-[140px]">{log.product}</p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  log.status === 'Autorizado'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Live Turnstile Feed (Catracas do Parque) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Feed de Acessos em Tempo Real nas Catracas (Parque Jaime Lerner)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ingresso, agência ou visitante..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <select
              value={filterGate}
              onChange={(e) => setFilterGate(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Todas as Catracas</option>
              <option value="Principal">Catraca 01 (Principal)</option>
              <option value="Grupos">Catraca 02 (Grupos)</option>
              <option value="VIP">Catraca 03 (VIP)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Horário & Data</th>
                <th className="py-3 px-4">Ingresso / Pedido</th>
                <th className="py-3 px-4">QR Code Token</th>
                <th className="py-3 px-4">Agência Origem</th>
                <th className="py-3 px-4">Produto / Pacote</th>
                <th className="py-3 px-4">Portão / Catraca</th>
                <th className="py-3 px-4 text-center">Status Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{log.time}</span>
                    <span className="text-[10px] text-slate-400">{log.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-700 font-mono block">{log.ticketId}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.orderId}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {log.qrCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {log.agencyName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.product}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {log.gate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'Autorizado'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {log.status}
                    </span>
                    {log.reason && (
                      <p className="text-[9px] text-rose-600 mt-0.5">{log.reason}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Hierarchy Path */}
      <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
        <span className="font-bold text-slate-800">Rastreabilidade Total:</span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Brasil</span>
        <span>→</span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Paraná</span>
        <span>→</span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Curitiba</span>
        <span>→</span>
        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">{selectedAgency.name}</span>
        <span>→</span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Venda B2B</span>
        <span>→</span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Ingresso Nominal</span>
        <span>→</span>
        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">Acesso Validado na Catraca</span>
      </div>

    </div>
  );
};
