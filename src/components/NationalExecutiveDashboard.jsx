import React from 'react';
import {
  Building2,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Ticket,
  Percent,
  Compass,
  MapPin,
  Award,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { NATIONAL_DASHBOARD_METRICS } from '../data/mockData';

export const NationalExecutiveDashboard = ({ onNavigateTab }) => {
  const m = NATIONAL_DASHBOARD_METRICS;

  const quickLinks = [
    { id: 'agencias', label: 'Agências' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'grupos', label: 'Grupos & Excursões' },
    { id: 'bilheteria', label: 'Vendas' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'contratos', label: 'Contratos B2B' },
    { id: 'divulgacao', label: 'Divulgação' },
    { id: 'integracoes', label: 'Integrações API' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-700/80 p-5 md:p-6 text-white shadow-xl space-y-6">
      
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400">
              Painel Executivo Nacional • Distribuição B2B
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            PARQUE JAIME LERNER — DISTRIBUIÇÃO B2B
          </h2>
          <p className="text-xs text-slate-400">
            Monitoramento consolidado de vendas turísticas, canais credenciados e capilaridade nacional.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400">Core Transacional:</span>
          <span className="font-bold text-orange-400">DiskIngressos PDT</span>
        </div>
      </div>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Agências ativas</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{m.activeAgencies}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+34 homologadas este mês</span>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Vendas B2B</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            R$ {(m.b2bSalesAmount / 1000).toFixed(0)} mil
          </p>
          <div className="text-[11px] text-slate-400 mt-1">
            R$ {m.b2bSalesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Reservas</span>
            <CalendarCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{m.activeReservations}</p>
          <div className="text-[11px] text-amber-400 mt-1">
            <span>87 ativas em carteira</span>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Receita Total</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            R$ {(m.totalRevenue / 1000).toFixed(0)} mil
          </p>
          <div className="text-[11px] text-slate-400 mt-1">
            R$ {m.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/40">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Ingressos vendidos</span>
            <Ticket className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-slate-100">{m.ticketsSold.toLocaleString('pt-BR')}</p>
          <span className="text-[10px] text-slate-400">grupos + individuais B2B</span>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/40">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Comissão gerada</span>
            <Percent className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-400">
            R$ {(m.totalCommissions / 1000).toFixed(0)} mil
          </p>
          <span className="text-[10px] text-slate-400">repasse retido para agências</span>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/40">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Conversão</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">{m.conversionRate}%</p>
          <span className="text-[10px] text-slate-400">reservas → check-in</span>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/40">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Estados</span>
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-indigo-300">{m.coveredStates}</p>
          <span className="text-[10px] text-slate-400">capilaridade turística nacional</span>
        </div>
      </div>

      {/* Row 3: Split into Vendas por Estado & Top Agências */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-slate-700/70">
        
        {/* Vendas por Estado (Col-7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Vendas por Estado (Ranking Turístico)</span>
            </h4>
            <span className="text-[11px] text-slate-400">19 Estados Atendidos</span>
          </div>

          <div className="space-y-2.5">
            {m.stateRankings.map((st) => (
              <div key={st.uf} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    {st.uf} <span className="text-slate-400 font-normal">({st.name})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{st.count} ingressos</span>
                    <span className="font-mono font-bold text-blue-300 text-xs">
                      {st.percentage}%
                    </span>
                  </div>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${st.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agências (Col-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Agências Parceiras</span>
            </h4>
            <span className="text-[11px] text-slate-400">Volume de Ingressos</span>
          </div>

          <div className="space-y-2">
            {m.topAgencies.map((agency, idx) => (
              <div
                key={agency.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    idx === 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                    idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{agency.name}</p>
                    <span className="text-[10px] text-slate-400">{agency.uf} • Categoria {agency.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-400 font-mono">{agency.salesCount}</span>
                  <p className="text-[10px] text-slate-400">vendas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 4: Interactive Quick Access Buttons */}
      <div className="pt-2 border-t border-slate-700/70">
        <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          Módulos do Sistema de Distribuição B2B:
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigateTab && onNavigateTab(link.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-white" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
