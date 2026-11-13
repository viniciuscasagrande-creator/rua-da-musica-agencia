import React, { useState } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  Percent,
  TrendingUp,
  Award,
  Link2,
  Ticket,
  Target,
  Briefcase,
  Settings,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Send,
  MoreHorizontal,
  QrCode,
  Sun,
  Moon,
  Copy,
  CheckCircle2,
  Building2,
  Shield
} from 'lucide-react';
import {
  SALES_TEAM_LIST,
  COMMISSION_LEDGER_ENTRIES,
  AGENCIES_LIST
} from '../../data/mockData';

export const ProducerDashboard = ({
  agencies: propAgencies,
  salesTeam: propSalesTeam,
  commissionLedger: propLedger,
  onCreateSalesAgent,
  onReverseCommission
}) => {
  const [section, setSection] = useState('equipe'); // 'equipe' | 'parcerias'
  const [activeTab, setActiveTab] = useState('promoters');
  const [darkMode, setDarkMode] = useState(false);
  const [localMembers, setLocalMembers] = useState(SALES_TEAM_LIST);
  const members = propSalesTeam || localMembers;
  const ledgerEntries = propLedger || COMMISSION_LEDGER_ENTRIES;
  const agenciesList = propAgencies || AGENCIES_LIST;
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [copiedCode, setCopiedCode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '(41) 99111-2233',
    email: '',
    role: 'Promoter',
    goalTarget: 200,
    commissionModel: 'Percentual (5%)'
  });

  const filteredMembers = members.filter((m) => {
    const matchText =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchRole = roleFilter === 'Todos' || m.role === roleFilter;
    return matchText && matchRole;
  });

  const handleCopyLink = (code) => {
    navigator.clipboard?.writeText(`https://rua-da-musica-agencia.vercel.app/?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    const parts = newMember.name.trim().split(' ');
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : newMember.name.slice(0, 2).toUpperCase();
    const slug = newMember.name.toLowerCase().replace(/\s+/g, '-');
    const created = {
      id: `PRM-0${members.length + 1}`,
      initials,
      avatarBg: 'bg-blue-600',
      name: newMember.name,
      phone: newMember.phone,
      email: newMember.email || `${slug}@promoter.com.br`,
      status: 'Ativo',
      role: newMember.role,
      salesCount: 0,
      ticketsCount: 0,
      revenue: 0,
      goalTarget: Number(newMember.goalTarget) || 200,
      goalPct: 0,
      goalColor: 'bg-blue-500',
      commission: 0,
      commissionPaid: 0,
      commissionPending: 0,
      commissionModel: newMember.commissionModel,
      conversion: 0,
      linkCode: `${slug}-3822`,
      couponCode: `${parts[0].toUpperCase()}10`,
      clicks: 0,
      sessions: 0,
      permissions: ['Vender ingressos', 'Criar link', 'Utilizar cupom', 'Consultar comissão']
    };
    if (onCreateSalesAgent) {
      onCreateSalesAgent(created);
    } else {
      setLocalMembers([created, ...members]);
    }
    setNewMember({
      name: '',
      phone: '(41) 99111-2233',
      email: '',
      role: 'Promoter',
      goalTarget: 200,
      commissionModel: 'Percentual (5%)'
    });
    setShowAddModal(false);
  };

  const cardClass = darkMode
    ? 'bg-slate-900 border-blue-500/50 ring-1 ring-blue-500/20 text-slate-100'
    : 'bg-white border-blue-300 ring-1 ring-blue-100 text-slate-950';

  const mutedText = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div
      className={`flex-1 flex flex-col xl:flex-row transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Left Sidebar (Event Context: ID 3822 — Experiência Música e Natureza) */}
      <aside
        className={`w-full xl:w-64 border-b xl:border-b-0 xl:border-r p-4 flex flex-col justify-between shrink-0 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="space-y-4">
          {/* Event Card */}
          <div
            className={`rounded-xl p-3 border flex items-center gap-3 ${
              darkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <img
              src="/assets/parque-sunset.jpg"
              alt="Evento 3822"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                ● Ativo
              </span>
              <h2 className="text-xs font-bold truncate mt-0.5">
                Experiência Música e Natureza - Setembro
              </h2>
              <span className={`text-[10px] ${mutedText}`}>ID: 3822</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1 text-xs">
            <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
              Módulo Comercial do Evento
            </div>

            <button
              onClick={() => setSection('equipe')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                section === 'equipe'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : darkMode
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Equipe de Vendas</span>
              </span>
            </button>

            {section === 'equipe' && (
              <div className="pl-4 space-y-1 pt-1">
                {[
                  { id: 'promoters', label: 'Promoters' },
                  { id: 'divulgadores', label: 'Divulgadores' },
                  { id: 'links', label: 'Links de Venda' },
                  { id: 'cupons', label: 'Cupons' },
                  { id: 'metas', label: 'Metas' },
                  { id: 'comissoes', label: 'Comissões' },
                  { id: 'financeiro', label: 'Financeiro & Ledger' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveTab(sub.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeTab === sub.id
                        ? 'text-blue-500 font-bold bg-blue-500/10'
                        : mutedText
                    }`}
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setSection('parcerias')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all mt-2 cursor-pointer ${
                section === 'parcerias'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : darkMode
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>Parcerias • Agências B2B</span>
              </span>
            </button>
          </div>
        </div>

        {/* System Tip Box (Replica of 10_26_12 & 10_27_42) */}
        <div
          className={`hidden xl:block mt-6 rounded-xl p-3.5 border text-xs ${
            darkMode
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span>👑 Dica do Sistema</span>
          </div>
          <p className="text-[11px] mt-1 opacity-90">
            {section === 'equipe'
              ? 'Promoters com meta ativa vendem em média 3x mais!'
              : 'Parcerias de turismo aumentam em até 35% o público de fora da sua região!'}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {section === 'equipe' ? (
          <>
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className={`text-[11px] ${mutedText}`}>
                  Eventos &gt; ID 3822 &gt; Equipe de Vendas &gt;{' '}
                  <span className="font-bold text-blue-500 capitalize">{activeTab}</span>
                </div>
                <h1 className="text-2xl font-extrabold mt-0.5">Equipe de Vendas</h1>
                <p className={`text-xs ${mutedText}`}>
                  Gerencie sua equipe de promoters, divulgadores, links, cupons, metas e comissões.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${cardClass}`}
                  title="Alternar entre Tema Claro (10_27_42) e Tema Escuro (10_26_12)"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Tema Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-slate-600" />
                      <span>Tema Escuro</span>
                    </>
                  )}
                </button>

                <div className={`px-3.5 py-2 rounded-xl border text-xs font-semibold ${cardClass}`}>
                  📅 01/09/2026 - 20/09/2026
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Promoter</span>
                </button>
              </div>
            </div>

            {/* 6 KPI Cards — Crisp Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-stretch">
              {[
                {
                  title: 'Vendas da Equipe',
                  value: '1.482',
                  badge: '↑ +18%',
                  sub: 'Ingressos',
                  iconBg: 'bg-emerald-600'
                },
                {
                  title: 'Receita Gerada',
                  value: 'R$ 184.320,00',
                  badge: '↑ +22%',
                  sub: 'Volume total',
                  iconBg: 'bg-blue-600'
                },
                {
                  title: 'Promoters Ativos',
                  value: '23',
                  badge: '↑ +9%',
                  sub: 'de 28 tot.',
                  iconBg: 'bg-purple-600'
                },
                {
                  title: 'Conversão',
                  value: '8,4%',
                  badge: '↑ +2,1%',
                  sub: 'Cliques → vendas',
                  iconBg: 'bg-orange-500'
                },
                {
                  title: 'Ticket Médio',
                  value: 'R$ 124,40',
                  badge: '↑ +6%',
                  sub: 'Por pedido',
                  iconBg: 'bg-amber-500'
                },
                {
                  title: 'Comissões',
                  value: 'R$ 9.216,00',
                  badge: '↑ +18%',
                  sub: 'Total devido',
                  iconBg: 'bg-rose-600'
                }
              ].map((kpi, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-3.5 shadow-xs flex flex-col justify-between gap-2 min-w-0 h-full ${cardClass}`}
                >
                  <div className="flex items-center justify-between gap-2 min-h-[2.5rem]">
                    <span className={`text-xs font-semibold leading-tight ${mutedText}`}>{kpi.title}</span>
                    <span
                      className={`w-7 h-7 rounded-lg ${kpi.iconBg} text-white font-mono text-xs font-bold flex items-center justify-center shrink-0`}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <div className="text-lg xl:text-[1.15rem] 2xl:text-xl font-mono font-bold tabular-nums tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                    {kpi.value}
                  </div>
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-500/15 text-[11px] min-h-[2rem]">
                    <span className="text-emerald-500 font-bold tabular-nums bg-emerald-500/10 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                      {kpi.badge}
                    </span>
                    <span className={`font-medium truncate text-right ${mutedText}`}>{kpi.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3 Charts Row: Vendas por Promoter (Top 5) | Evolução de Vendas | Distribuição por Tipo de Ingresso */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Top 5 Promoters */}
              <div className={`lg:col-span-4 rounded-2xl border p-5 shadow-xs space-y-3.5 ${cardClass}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wide">
                    Vendas por Promoter (Top 5)
                  </h3>
                  <span className={`text-[11px] font-semibold ${mutedText}`}>Ingressos</span>
                </div>
                <div className="space-y-3 text-xs">
                  {members.slice(0, 5).map((m, idx) => (
                    <div key={m.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-amber-500">
                            #{idx + 1}
                          </span>
                          <span>{m.name}</span>
                        </span>
                        <span className="font-mono font-bold tabular-nums">
                          {m.salesCount}{' '}
                          <span className={`text-[11px] font-medium ${mutedText}`}>
                            (R$ {m.revenue.toLocaleString('pt-BR')})
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-500/15 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, (m.salesCount / 300) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolução de Vendas */}
              <div
                className={`lg:col-span-4 rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${cardClass}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wide">Evolução de Vendas</h3>
                  <span className={`text-[11px] font-semibold ${mutedText}`}>Últimos 30 dias</span>
                </div>
                <div className="my-4 h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-500/15">
                  {[
                    { d: '01/09', v: 40, r: 32, val: '210' },
                    { d: '05/09', v: 55, r: 46, val: '265' },
                    { d: '10/09', v: 68, r: 58, val: '310' },
                    { d: '15/09', v: 82, r: 74, val: '342' },
                    { d: '20/09', v: 95, r: 88, val: '355' }
                  ].map((pt) => (
                    <div key={pt.d} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold tabular-nums">
                        {pt.val}
                      </span>
                      <div className="w-full flex items-end justify-center gap-1 h-24">
                        <div
                          className="w-3 bg-blue-600 rounded-t-xs"
                          style={{ height: `${pt.v}%` }}
                        />
                        <div
                          className="w-3 bg-orange-500 rounded-t-xs"
                          style={{ height: `${pt.r}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[11px] font-semibold pb-1 ${mutedText}`}>
                        {pt.d}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`flex justify-center gap-5 text-xs font-semibold ${mutedText}`}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Vendas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-orange-500" /> Receita (R$)
                  </span>
                </div>
              </div>

              {/* Distribuição por Tipo de Ingresso — Crisp Vector SVG Donut */}
              <div
                className={`lg:col-span-4 rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${cardClass}`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  Distribuição por Tipo de Ingresso
                </h3>
                <div className="flex items-center gap-5 my-2">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#334155" strokeOpacity="0.2" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="46 54" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-46" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="11 89" strokeDashoffset="-71" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="6 94" strokeDashoffset="-82" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-sm font-bold tabular-nums leading-none">
                        1.482
                      </span>
                      <span className={`text-[10px] font-semibold mt-0.5 ${mutedText}`}>
                        vendas
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs flex-1">
                    {[
                      { label: 'Pista', pct: '52%', color: 'bg-blue-600' },
                      { label: 'VIP', pct: '28%', color: 'bg-orange-500' },
                      { label: 'Camarote', pct: '12%', color: 'bg-emerald-500' },
                      { label: 'Área Premium', pct: '6%', color: 'bg-purple-500' },
                      { label: 'Outros', pct: '2%', color: 'bg-slate-400' }
                    ].map((t) => (
                      <div key={t.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-semibold">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                          <span>{t.label}</span>
                        </span>
                        <span className="font-mono font-bold tabular-nums">{t.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-navigation bar */}
            <div className={`rounded-xl border px-3 py-1.5 flex flex-wrap gap-1 ${cardClass}`}>
              {[
                { id: 'promoters', label: 'Promoters' },
                { id: 'divulgadores', label: 'Divulgadores' },
                { id: 'links', label: 'Links de Venda' },
                { id: 'cupons', label: 'Cupons' },
                { id: 'metas', label: 'Metas' },
                { id: 'comissoes', label: 'Comissões' },
                { id: 'financeiro', label: 'Financeiro (Ledger)' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-blue-600 text-white font-bold'
                      : `${mutedText} hover:bg-slate-500/10`
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Operational Table or Specific Sub-tab */}
            {activeTab !== 'financeiro' ? (
              <div className={`rounded-2xl border p-5 shadow-xs space-y-4 ${cardClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={`flex items-center border rounded-xl px-3 py-1.5 ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Buscar promoter (nome, email, telefone)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent focus:outline-none w-56"
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className={`border rounded-xl px-3 py-1.5 ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="Todos">Todos os Tipos</option>
                      <option value="Promoter">Promoter</option>
                      <option value="Divulgador">Divulgador</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold"
                    >
                      + Novo Membro
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b border-slate-500/20 uppercase text-[11px] ${mutedText}`}>
                        <th className="py-3 px-3">Promoter</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Tipo</th>
                        <th className="py-3 px-3 text-right">Vendas</th>
                        <th className="py-3 px-3 text-right">Ingressos</th>
                        <th className="py-3 px-3 text-right">Receita</th>
                        <th className="py-3 px-3">Meta</th>
                        <th className="py-3 px-3 text-right">Comissão</th>
                        <th className="py-3 px-3 text-right">Conversão</th>
                        <th className="py-3 px-3 text-center">Link / Cupom</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/15">
                      {filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-500/5">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full ${m.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                              >
                                {m.initials}
                              </div>
                              <div>
                                <div className="font-bold">{m.name}</div>
                                <div className={`text-[11px] ${mutedText}`}>{m.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                m.status === 'Ativo'
                                  ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                              }`}
                            >
                              ● {m.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-medium">{m.role}</td>
                          <td className="py-3.5 px-3 text-right font-bold">{m.salesCount}</td>
                          <td className="py-3.5 px-3 text-right">{m.ticketsCount}</td>
                          <td className="py-3.5 px-3 text-right font-bold">
                            R$ {m.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 w-36">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span>{m.goalTarget}</span>
                              <span className="font-bold">{m.goalPct}%</span>
                            </div>
                            <div className="w-full bg-slate-500/20 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`${m.goalColor} h-full rounded-full`}
                                style={{ width: `${m.goalPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="font-extrabold text-emerald-500">
                              R$ {m.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`text-[10px] ${mutedText}`}>{m.commissionModel}</div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-semibold">{m.conversion}%</td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleCopyLink(m.linkCode)}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                title="Copiar Link Rastreável"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{copiedCode === m.linkCode ? 'Copiado!' : m.couponCode}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* TAB FINANCEIRO & LEDGER APPEND-ONLY */
              <div className={`rounded-2xl border p-6 shadow-xs space-y-4 ${cardClass}`}>
                <div>
                  <h3 className="text-base font-bold">
                    Razão de Comissões & Estornos (Append-Only Ledger PDT)
                  </h3>
                  <p className={`text-xs ${mutedText}`}>
                    Conforme model `CommissionEntry` do Prisma: vendas geram `ACCRUAL`, estornos
                    geram `REVERSAL` (sem apagar o histórico) e pagamentos geram `SETTLEMENT`.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b border-slate-500/20 uppercase text-[11px] ${mutedText}`}>
                        <th className="py-3 px-3">ID Ledger</th>
                        <th className="py-3 px-3">Pedido</th>
                        <th className="py-3 px-3">Promoter</th>
                        <th className="py-3 px-3">Tipo (Kind)</th>
                        <th className="py-3 px-3">Histórico / Atribuição</th>
                        <th className="py-3 px-3 text-right">Valor</th>
                        <th className="py-3 px-3">Data</th>
                        <th className="py-3 px-3 text-center">Auditoria / Estorno</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/15">
                      {ledgerEntries.map((ce) => (
                        <tr key={ce.id}>
                          <td className="py-3 px-3 font-mono font-bold text-blue-500">{ce.id}</td>
                          <td className="py-3 px-3 font-mono">{ce.orderId}</td>
                          <td className="py-3 px-3 font-bold">{ce.promoterName}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ce.kind === 'ACCRUAL'
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : ce.kind === 'REVERSAL'
                                  ? 'bg-rose-500/15 text-rose-500'
                                  : 'bg-blue-500/15 text-blue-500'
                              }`}
                            >
                              {ce.kind}
                            </span>
                          </td>
                          <td className="py-3 px-3">{ce.label}</td>
                          <td
                            className={`py-3 px-3 text-right font-black ${
                              ce.amount < 0 ? 'text-rose-500' : 'text-emerald-500'
                            }`}
                          >
                            {ce.amount > 0 ? '+' : ''}R$ {ce.amount.toFixed(2).replace('.', ',')}
                          </td>
                          <td className={`py-3 px-3 ${mutedText}`}>{ce.createdAt}</td>
                          <td className="py-3 px-3 text-center">
                            {ce.kind === 'ACCRUAL' && onReverseCommission ? (
                              <button
                                onClick={() => onReverseCommission(ce.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 font-bold text-[10px] cursor-pointer"
                              >
                                Estornar (Append-Only)
                              </button>
                            ) : (
                              <span className={`text-[10px] ${mutedText}`}>Imutável</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          /* SECTION 2: PARCERIAS > AGÊNCIAS DE TURISMO (Exact replica of 10_53_03.png) */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className={`text-[11px] ${mutedText}`}>
                  Eventos &gt; ID 3822 &gt; Parcerias &gt;{' '}
                  <span className="font-bold text-blue-500">Agências de Turismo</span>
                </div>
                <h1 className="text-2xl font-extrabold mt-0.5">Agências de Turismo</h1>
                <p className={`text-xs ${mutedText}`}>
                  Gerencie agências parceiras, pacotes turísticos e acompanhe as vendas integradas
                  com o seu evento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-stretch">
              {[
                { label: 'Agências Parceiras', value: '12', sub: '↑ +20% vs. ant.' },
                { label: 'Pacotes Ativos', value: '28', sub: '↑ +33% vs. ant.' },
                { label: 'Ingressos via Agências', value: '1.842', sub: '↑ +27% vs. ant.' },
                { label: 'Receita Gerada', value: 'R$ 184.320,00', sub: '↑ +31% vs. ant.' },
                { label: 'Turistas Estimados', value: '2.640', sub: '↑ +26% vs. ant.' },
                { label: 'Taxa de Conversão', value: '8,4%', sub: '↑ +2,1% vs. ant.' }
              ].map((k, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-3.5 shadow-xs flex flex-col justify-between gap-2 min-w-0 h-full ${cardClass}`}
                >
                  <span className={`text-xs font-semibold leading-tight min-h-[2.25rem] flex items-center ${mutedText}`}>
                    {k.label}
                  </span>
                  <div className="text-lg xl:text-[1.15rem] 2xl:text-xl font-mono font-bold tabular-nums tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                    {k.value}
                  </div>
                  <div className="text-[11px] text-emerald-500 font-bold tabular-nums pt-1 border-t border-slate-500/15">
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className={`rounded-2xl border p-5 shadow-xs space-y-4 ${cardClass}`}>
              <h3 className="text-sm font-bold">Agências Parceiras Vinculadas ao Evento</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b border-slate-500/20 uppercase text-[11px] ${mutedText}`}>
                    <th className="py-3 px-3">Agência</th>
                    <th className="py-3 px-3">Cidade</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Pacotes</th>
                    <th className="py-3 px-3 text-right">Vendas</th>
                    <th className="py-3 px-3 text-right">Receita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/15">
                  {agenciesList.map((ag) => (
                    <tr key={ag.id}>
                      <td className="py-3.5 px-3 font-bold">{ag.name}</td>
                      <td className="py-3.5 px-3">{ag.cityUf}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                          ● {ag.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">{ag.packagesCount}</td>
                      <td className="py-3.5 px-3 text-right font-bold">{ag.bookingsCount}</td>
                      <td className="py-3.5 px-3 text-right font-extrabold">
                        R$ {ag.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Adicionar Promoter / Divulgador */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold">Adicionar Membro à Equipe de Vendas</h3>
            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriel Martins"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perfil Operacional</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  >
                    <option value="Promoter">Promoter</option>
                    <option value="Divulgador">Divulgador</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta (Ingressos)</label>
                  <input
                    type="number"
                    value={newMember.goalTarget}
                    onChange={(e) => setNewMember({ ...newMember, goalTarget: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Regra de Comissão</label>
                <select
                  value={newMember.commissionModel}
                  onChange={(e) => setNewMember({ ...newMember, commissionModel: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="Percentual (5%)">Percentual (5% sobre vendas confirmadas)</option>
                  <option value="Valor Fixo (R$ 4,00/ing)">Valor Fixo (R$ 4,00 por ingresso)</option>
                  <option value="Por Ingresso (Pista R$ 3 / VIP R$ 7)">
                    Por Tipo de Ingresso (Pista R$ 3 / VIP R$ 7 / Camarote R$ 15)
                  </option>
                  <option value="Progressiva (3% a 10%)">
                    Progressiva (0-50: 3% / 51-100: 5% / 101-200: 7% / 201+: 10%)
                  </option>
                </select>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <strong className="text-slate-800 block mb-1">
                  Permissões RBAC Reaproveitadas do PDT:
                </strong>
                Vender ingressos • Criar link rastreável • Utilizar cupom • Consultar comissão •
                Solicitar pagamento
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Criar e Gerar Link + QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
