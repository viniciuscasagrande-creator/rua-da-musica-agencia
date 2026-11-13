import React, { useState } from 'react';
import {
  LayoutDashboard,
  Ticket,
  Store,
  Briefcase,
  Building2,
  CalendarCheck,
  QrCode,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Eye,
  Link2,
  MoreHorizontal,
  MapPin,
  FileText,
  TrendingUp,
  Calculator,
  CheckCircle2,
  Percent
} from 'lucide-react';
import {
  AGENCIES_LIST,
  B2B_TICKET_TYPES,
  BOOKINGS_LIST,
  STATE_ORIGIN_DATA
} from '../../data/mockData';

export const OperatorDashboard = ({
  agencies: propAgencies,
  bookings: propBookings,
  onCreateAgency,
  onOpenVoucher
}) => {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [localAgencies, setLocalAgencies] = useState(AGENCIES_LIST);
  const agencies = propAgencies || localAgencies;
  const bookingsList = propBookings || BOOKINGS_LIST;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [simBasePrice, setSimBasePrice] = useState(30);
  const [feeBps, setFeeBps] = useState(600); // 6.0%
  const [showNewAgencyModal, setShowNewAgencyModal] = useState(false);
  const [newAgencyForm, setNewAgencyForm] = useState({
    name: '',
    cnpj: '',
    cityUf: 'Curitiba - PR',
    quotaLimit: 500
  });

  const feePct = feeBps / 100;
  const simFeeAmount = (Number(simBasePrice || 0) * feePct) / 100;
  const simFinalPrice = Number(simBasePrice || 0) + simFeeAmount;

  const filteredAgencies = agencies.filter((ag) => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.cnpj.includes(searchTerm) ||
      ag.cityUf.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || ag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAgency = (e) => {
    e.preventDefault();
    if (!newAgencyForm.name) return;
    const created = {
      id: `AG-00${agencies.length + 1}`,
      name: newAgencyForm.name,
      cnpj: newAgencyForm.cnpj || '19.400.120/0001-88',
      cityUf: newAgencyForm.cityUf,
      state: newAgencyForm.cityUf.split('-')[1]?.trim() || 'PR',
      status: 'Ativa',
      quotaLimit: Number(newAgencyForm.quotaLimit) || 500,
      bookingsCount: 0,
      ticketsSold: 0,
      revenue: 0,
      packagesCount: 1
    };
    if (onCreateAgency) {
      onCreateAgency(created);
    } else {
      setLocalAgencies([created, ...agencies]);
    }
    setNewAgencyForm({ name: '', cnpj: '', cityUf: 'Curitiba - PR', quotaLimit: 500 });
    setShowNewAgencyModal(false);
  };

  const sidebarItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'estoque', label: 'Ingressos & Estoque', icon: Ticket },
    { id: 'bilheteria', label: 'Bilheteria Local', icon: Store },
    { id: 'visao-geral', label: 'Distribuição Turística', icon: Briefcase, highlight: true },
    { id: 'agencias', label: 'Agências', icon: Building2 },
    { id: 'reservas', label: 'Reservas', icon: CalendarCheck },
    { id: 'vouchers', label: 'Vouchers & Catraca', icon: QrCode },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const subTabs = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'agencias', label: 'Agências' },
    { id: 'tarifario', label: 'Tarifário B2B' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'vouchers', label: 'Vouchers' },
    { id: 'comissoes', label: 'Comissões' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'configuracoes', label: 'Configurações' }
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row bg-[#f8fafc]">
      {/* Left Sidebar (Matching 11_26_17.png & video) */}
      <aside className="w-full xl:w-64 bg-white border-b xl:border-b-0 xl:border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="h-24 relative">
              <img
                src="/assets/parque-thumb.jpg"
                alt="Parque Jaime Lerner"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider">
                PARQUE CULTURAL
              </span>
            </div>
            <div className="p-3">
              <h2 className="font-bold text-sm text-slate-900">Parque Jaime Lerner</h2>
              <p className="text-[11px] text-slate-500">Rua da Música • Curitiba - PR</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id && (item.highlight || item.id !== 'visao-geral');
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cultural Card */}
        <div className="hidden xl:block mt-6 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-2.5">
          <div className="font-bold text-slate-800">Mais turistas para a cultura brasileira</div>
          <p className="text-[11px] text-slate-500">
            Parcerias que conectam destinos e experiências com inventário centralizado.
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src="/assets/sidebar-bottom-promo.jpg"
              alt="Parque Jaime Lerner"
              className="w-16 h-20 rounded-lg object-cover shrink-0 border border-slate-200"
            />
            <div className="text-[10px] font-bold text-blue-800 tracking-wider uppercase leading-relaxed">
              MÚSICA<br />ARTE<br />NATUREZA<br />CURITIBA
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-5 space-y-4 max-w-[1700px] mx-auto w-full">
        {/* Top Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              Parque Jaime Lerner &gt; Distribuição Turística B2B &gt;{' '}
              <span className="text-slate-700 font-semibold">Visão Geral</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Distribuição Turística B2B
            </h1>
            <p className="text-xs text-slate-500">
              Venda de ingressos e pacotes para agências de turismo de todo o Brasil.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              📅 01/09/2026 - 30/09/2026
            </div>
            <button
              onClick={() => setShowNewAgencyModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Agência</span>
            </button>
          </div>
        </div>

        {/* Horizontal Sub-Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 px-3 py-1.5 flex flex-wrap items-center gap-1 shadow-xs">
          {subTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VISÃO GERAL (Exact replica of 11_26_17.png) */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-4">
            {/* 6 KPI Cards — Crisp Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 auto-rows-fr">
              {[
                {
                  label: 'Agências Ativas',
                  value: '42',
                  change: '↑ +16%',
                  sub: 'vs. mês ant.',
                  color: 'bg-blue-600'
                },
                {
                  label: 'Estados Atendidos',
                  value: '18',
                  change: '↑ +12%',
                  sub: 'vs. mês ant.',
                  color: 'bg-emerald-600'
                },
                {
                  label: 'Reservas B2B',
                  value: '1.248',
                  change: '↑ +28%',
                  sub: 'vs. mês ant.',
                  color: 'bg-purple-600'
                },
                {
                  label: 'Ingressos Distribuídos',
                  value: '6.842',
                  change: '↑ +32%',
                  sub: 'vs. mês ant.',
                  color: 'bg-amber-500'
                },
                {
                  label: 'Receita Bruta',
                  value: 'R$ 214.320,00',
                  change: '↑ +30%',
                  sub: 'vs. mês ant.',
                  color: 'bg-teal-600'
                },
                {
                  label: 'Taxas DiskIngressos',
                  value: 'R$ 12.859,20',
                  change: '6% contratado',
                  sub: 'Repasse PDT',
                  color: 'bg-rose-600'
                }
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 p-3 shadow-xs flex flex-col justify-between gap-1.5 min-w-0 h-[128px] overflow-hidden"
                >
                  <div className="flex items-center gap-2 h-9">
                    <div
                      className={`w-7 h-7 rounded-lg ${kpi.color} text-white flex items-center justify-center font-mono font-bold text-xs shrink-0`}
                    >
                      0{idx + 1}
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {kpi.label}
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold tabular-nums tracking-tighter text-slate-950 whitespace-nowrap overflow-hidden text-ellipsis">
                    {kpi.value}
                  </div>
                  <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] h-7">
                    <span className="font-bold tabular-nums text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                      {kpi.change}
                    </span>
                    <span className="text-slate-600 font-medium truncate text-right">{kpi.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Charts + Right Price Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch lg:auto-rows-[300px]">
              {/* Vendas por Estado */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                    Vendas por Estado
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold">
                    Ingressos
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  {STATE_ORIGIN_DATA.map((st) => (
                    <div key={st.uf} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-800 font-semibold">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: st.color }}
                          />
                          {st.state}
                        </span>
                        <span className="font-mono font-bold tabular-nums text-slate-950">
                          {st.share}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${st.share}%`, backgroundColor: st.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolução das Reservas B2B */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                    Evolução B2B
                  </h3>
                  <span className="text-[11px] font-medium text-slate-600">Últimos 30 dias</span>
                </div>

                <div className="my-4 h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
                  {[
                    { d: '01/09', r: 35, i: 50, val: '180' },
                    { d: '07/09', r: 48, i: 64, val: '245' },
                    { d: '14/09', r: 62, i: 78, val: '312' },
                    { d: '21/09', r: 85, i: 95, val: '420' },
                    { d: '30/09', r: 76, i: 88, val: '385' }
                  ].map((bar) => (
                    <div key={bar.d} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold tabular-nums text-slate-700">
                        {bar.val}
                      </span>
                      <div className="w-full flex items-end justify-center gap-1 h-24">
                        <div
                          className="w-3 bg-blue-600 rounded-t-xs"
                          style={{ height: `${bar.r}%` }}
                          title="Reservas"
                        />
                        <div
                          className="w-3 bg-amber-500 rounded-t-xs"
                          style={{ height: `${bar.i}%` }}
                          title="Ingressos"
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-700 pb-1">
                        {bar.d}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Reservas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" /> Ingressos
                  </span>
                </div>
              </div>

              {/* Origem dos Turistas — Crisp Vector SVG Donut */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                  Origem dos Turistas (UF)
                </h3>
                <div className="flex items-center gap-4 my-2">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="18 82" strokeDashoffset="-25" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="14 86" strokeDashoffset="-43" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-57" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-sm font-bold tabular-nums text-slate-950 leading-none">
                        6.842
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                        ingressos
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs flex-1">
                    {STATE_ORIGIN_DATA.map((st) => (
                      <div key={st.uf} className="flex items-center justify-between">
                        <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: st.color }}
                          />
                          {st.uf}
                        </span>
                        <span className="font-mono font-bold tabular-nums text-slate-950">
                          {st.share}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-center bg-blue-50 border border-blue-200/70 text-blue-800 rounded-lg py-1.5 font-semibold">
                  Principal emissor: <strong className="font-bold">Paraná (28%)</strong>
                </div>
              </div>

              {/* Right Column: Composição do Preço (B2B) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between gap-3">
                <div className="rounded-xl overflow-hidden relative h-24">
                  <img
                    src="/assets/parque-banner.jpg"
                    alt="Parque Jaime Lerner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 p-3 flex flex-col justify-end text-white">
                    <span className="text-xs font-black">PARQUE JAIME LERNER</span>
                    <span className="text-[10px] text-slate-200">Rua da Música • Curitiba - PR</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900">🏷️ Composição do Preço (B2B)</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Ingresso Parque (Inteira)</span>
                    <span className="font-bold text-slate-900">R$ 30,00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxa adm. DiskIngressos (6%)</span>
                    <span className="font-bold text-slate-900">R$ 1,80</span>
                  </div>
                  <div className="flex justify-between bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-extrabold">
                    <span>Total do ingresso B2B</span>
                    <span>R$ 31,80</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Table: Agências Parceiras */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agências Parceiras</h3>
                  <p className="text-xs text-slate-500">
                    Gestão de canais credenciados, cotas e limites de distribuição
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Buscar agência (nome, CNPJ, cidade)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent focus:outline-none text-slate-800 w-52"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-3">Agência</th>
                      <th className="py-3 px-3">Cidade / UF</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Limite / Cota</th>
                      <th className="py-3 px-3 text-right">Reservas</th>
                      <th className="py-3 px-3 text-right">Ingressos</th>
                      <th className="py-3 px-3 text-right">Receita (R$)</th>
                      <th className="py-3 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAgencies.map((ag) => (
                      <tr key={ag.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{ag.name}</div>
                          <div className="text-[11px] text-slate-400">{ag.cnpj}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{ag.cityUf}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ag.status === 'Ativa'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            ● {ag.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-semibold text-slate-700">
                          {ag.quotaLimit.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3.5 px-3 text-right text-slate-700">
                          {ag.bookingsCount}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                          {ag.ticketsSold.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                          {ag.revenue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
                              <Link2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGÊNCIAS */}
        {activeTab === 'agencias' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Agências Parceiras Credenciadas</h3>
                <p className="text-xs text-slate-500">
                  Controle de contratos B2B, CNPJ normalizado, cotas mensais e taxa administrativa por evento
                </p>
              </div>
              <button
                onClick={() => setShowNewAgencyModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                + Cadastrar Agência B2B
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-3">Agência / CNPJ</th>
                    <th className="py-3 px-3">Cidade / UF</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Cota Mensal</th>
                    <th className="py-3 px-3 text-right">Reservas</th>
                    <th className="py-3 px-3 text-right">Ingressos</th>
                    <th className="py-3 px-3 text-right">Receita B2B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agencies.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{ag.name}</div>
                        <div className="text-[11px] text-slate-400">{ag.cnpj}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{ag.cityUf}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● {ag.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold">{ag.quotaLimit}</td>
                      <td className="py-3.5 px-3 text-right">{ag.bookingsCount}</td>
                      <td className="py-3.5 px-3 text-right font-bold">{ag.ticketsSold}</td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        R$ {ag.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TARIFÁRIO B2B & SIMULADOR (Matching video 00:08 - 00:24) */}
        {activeTab === 'tarifario' && (
          <div className="space-y-6">
            {/* Blue Header Banner */}
            <div className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5 max-w-xl">
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Percent className="w-5 h-5 text-blue-300" />
                  <span>Tarifário B2B & Parametrização de Taxa</span>
                </h2>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Catálogo de produtos comercializáveis para agências de turismo credenciadas. A taxa
                  administrativa DiskIngressos é parametrizada no cadastro (`AgencyEvent.feeBps`) e
                  embutida no valor final cobrado da agência parceira.
                </p>
              </div>

              <div className="bg-blue-950/60 border border-white/15 rounded-xl p-4 min-w-[260px] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200 font-semibold">Taxa Administrativa PDT:</span>
                  <span className="text-base font-black text-white">{feePct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500}
                  step={50}
                  value={feeBps}
                  onChange={(e) => setFeeBps(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-blue-300">
                  <span>0% (Isento)</span>
                  <span>Padrão 6% (600 bps)</span>
                  <span>15%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Catálogo de Ingressos Ativos */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Catálogo de Ingressos Ativos</h3>
                    <p className="text-xs text-slate-500">
                      Valores comercializados pelo Parque Jaime Lerner no canal B2B
                    </p>
                  </div>
                  <button className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
                    + Novo Tipo
                  </button>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-3">Produto</th>
                      <th className="py-3 px-3">Preço-Base (Operador)</th>
                      <th className="py-3 px-3">Taxa Disk ({feePct.toFixed(1)}%)</th>
                      <th className="py-3 px-3">Preço Final B2B</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {B2B_TICKET_TYPES.map((t) => {
                      const calcFee = (t.basePrice * feePct) / 100;
                      const calcTotal = t.basePrice + calcFee;
                      return (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900">{t.name}</div>
                            <div className="text-[11px] text-slate-400">{t.description}</div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700">
                            R$ {t.basePrice.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500">
                            + R$ {calcFee.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-blue-600">
                            R$ {calcTotal.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Right: Simulador de Pacote / Cotação */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Simulador de Pacote / Cotação
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Calcule instantaneamente o repasse líquido para o operador e a taxa administrativa
                  com base em novos produtos ou convênios.
                </p>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700 block">Preço-Base Sugerido (R$)</label>
                  <input
                    type="number"
                    value={simBasePrice}
                    onChange={(e) => setSimBasePrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-bold text-slate-900"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Preço-Base do Parque:</span>
                    <span className="font-bold text-slate-900">
                      R$ {Number(simBasePrice || 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxa DiskIngressos ({feePct.toFixed(1)}%):</span>
                    <span className="font-bold text-blue-600">
                      + R$ {simFeeAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                    <span>Preço Final para a Agência:</span>
                    <span className="text-blue-700">
                      R$ {simFinalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900">
                  <strong className="block">Repasse Garantido</strong>
                  O valor de R$ {Number(simBasePrice || 0).toFixed(2).replace('.', ',')} é repassado
                  integralmente ao operador na conciliação semanal do PDT.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 & 5: RESERVAS & VOUCHERS (Matching video 00:09) */}
        {(activeTab === 'reservas' || activeTab === 'vouchers' || activeTab === 'estoque') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reservas de Grupos & Excursões B2B
                </h3>
                <p className="text-xs text-slate-500">
                  Fluxo unificado da pré-reserva de agência até o check-in por QR Code na entrada do
                  parque
                </p>
              </div>
              <div className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl">
                Estoque Diário Centralizado: Site (1.500) • Bilheteria (800) • Agências B2B (700)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-3">Código</th>
                    <th className="py-3 px-3">Agência Parceira</th>
                    <th className="py-3 px-3">Grupo / Identificação</th>
                    <th className="py-3 px-3">Data & Horário</th>
                    <th className="py-3 px-3 text-center">Visitantes</th>
                    <th className="py-3 px-3 text-right">Valor Total B2B</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 font-mono font-bold text-blue-600">{b.id}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{b.agencyName}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{b.groupName}</div>
                        <div className="text-[11px] text-slate-400">{b.coordinator}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">
                        <div>{b.visitDate}</div>
                        <div className="text-[11px] text-slate-400">{b.visitTime}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                        {b.ticketsCount} pax
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-black text-slate-900">
                          R$ {b.totalAmount.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          c/ R$ {b.diskFeeAmount.toFixed(2).replace('.', ',')} taxa Disk
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => onOpenVoucher && onOpenVoucher(b)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ver Voucher</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTHER TABS: COMISSÕES, FINANCEIRO, RELATÓRIOS, CONFIGURAÇÕES */}
        {['comissoes', 'financeiro', 'relatorios', 'configuracoes', 'bilheteria'].includes(
          activeTab
        ) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">
              Módulo Integrado ao Core PDT DiskIngressos ({activeTab.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Conciliação financeira, repasses líquidos ao Parque Jaime Lerner, apuração da taxa
              administrativa de 6% e logs de auditoria conectados diretamente ao Ledger PostgreSQL do
              PDT.
            </p>
            <button
              onClick={() => setActiveTab('visao-geral')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Voltar para Visão Geral
            </button>
          </div>
        )}
      </main>

      {/* Modal: Nova Agência */}
      {showNewAgencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Credenciar Nova Agência de Turismo B2B
            </h3>
            <form onSubmit={handleCreateAgency} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Razão Social / Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Horizonte Turismo & Excursões"
                  value={newAgencyForm.name}
                  onChange={(e) => setNewAgencyForm({ ...newAgencyForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">CNPJ *</label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={newAgencyForm.cnpj}
                  onChange={(e) => setNewAgencyForm({ ...newAgencyForm, cnpj: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    value={newAgencyForm.cityUf}
                    onChange={(e) => setNewAgencyForm({ ...newAgencyForm, cityUf: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cota de Ingressos</label>
                  <input
                    type="number"
                    value={newAgencyForm.quotaLimit}
                    onChange={(e) =>
                      setNewAgencyForm({ ...newAgencyForm, quotaLimit: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewAgencyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Salvar Agência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
