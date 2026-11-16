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
  onCheckinVoucher,
  onOpenVoucher
}) => {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [localAgencies, setLocalAgencies] = useState(AGENCIES_LIST);
  const [agencyOverrides, setAgencyOverrides] = useState({});
  const agencies = (propAgencies || localAgencies).map((a) =>
    agencyOverrides[a.id] ? { ...a, ...agencyOverrides[a.id] } : a
  );
  const bookingsList = propBookings || BOOKINGS_LIST;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('Todos');
  const [scannerCode, setScannerCode] = useState('');
  const [scannerFeedback, setScannerFeedback] = useState(null);
  const [copiedAgencyId, setCopiedAgencyId] = useState(null);
  const [selectedAgencyDetail, setSelectedAgencyDetail] = useState(null);
  const [ticketCatalog, setTicketCatalog] = useState(B2B_TICKET_TYPES);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    name: '',
    description: '',
    basePrice: 40
  });
  const [channelQuotas, setChannelQuotas] = useState({
    site: 1500,
    bilheteria: 800,
    b2b: 700
  });
  const [pdvForm, setPdvForm] = useState({
    booth: 'Guichê 01 — Entrada Principal',
    ticketType: 'Ingresso Parque (Inteira) — R$ 30,00',
    unitPrice: 30,
    qty: 2,
    payment: 'PIX QR Dinâmico'
  });
  const [pdvSales, setPdvSales] = useState([
    {
      id: 'PDV-8841',
      time: '13:42',
      booth: 'Guichê 01 — Entrada Principal',
      item: '2x Ingresso Parque (Inteira)',
      payment: 'PIX QR Dinâmico',
      total: 60
    },
    {
      id: 'PDV-8840',
      time: '13:35',
      booth: 'Guichê 02 — Prioridade / Meia',
      item: '3x Ingresso Meia-Entrada',
      payment: 'Cartão de Débito',
      total: 45
    },
    {
      id: 'PDV-8839',
      time: '13:21',
      booth: 'Totem Autoatendimento 01',
      item: '1x Visita + Tour Guiado',
      payment: 'Cartão de Crédito',
      total: 45
    }
  ]);
  const [parkSettings, setParkSettings] = useState({
    dailyCapacity: 3000,
    b2bMaxQuota: 700,
    holdExpirationHours: 48,
    defaultCreditLimit: 50000,
    batchQrCheckin: true,
    autoTurnstileSync: true,
    savedSuccess: false
  });
  const [simBasePrice, setSimBasePrice] = useState(30);
  const [feeBps, setFeeBps] = useState(600); // 6.0%
  const [showNewAgencyModal, setShowNewAgencyModal] = useState(false);
  const [periodStart, setPeriodStart] = useState('2026-09-01');
  const [periodEnd, setPeriodEnd] = useState('2026-09-30');
  const [newAgencyForm, setNewAgencyForm] = useState({
    name: '',
    cnpj: '',
    cityUf: 'Curitiba - PR',
    quotaLimit: 500
  });

  const feePct = feeBps / 100;
  const simFeeAmount = (Number(simBasePrice || 0) * feePct) / 100;
  const simFinalPrice = Number(simBasePrice || 0) + simFeeAmount;


  // ---------- Métricas reais (a partir de agências e reservas) no período selecionado ----------
  const DAY = 86400000;
  const dateOf = (b) => String(b.visitDate || '').slice(0, 10);
  const toTs = (iso) => new Date(`${iso}T00:00:00`).getTime();
  const brl = (n) => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const brNum = (n) => Number(n || 0).toLocaleString('pt-BR');
  const fmtDay = (ts) => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const startTs = toTs(periodStart);
  const endTs = toTs(periodEnd);
  const validPeriod = !Number.isNaN(startTs) && !Number.isNaN(endTs) && endTs >= startTs;
  const spanDays = validPeriod ? Math.round((endTs - startTs) / DAY) + 1 : 30;
  const prevEndTs = startTs - DAY;
  const prevStartTs = prevEndTs - (spanDays - 1) * DAY;

  const bookingsBetween = (from, to) =>
    validPeriod
      ? bookingsList.filter((b) => {
          const t = toTs(dateOf(b));
          return t >= from && t <= to;
        })
      : [];
  const curBookings = bookingsBetween(startTs, endTs);
  const prevBookings = bookingsBetween(prevStartTs, prevEndTs);

  const sumBy = (arr, key) => arr.reduce((acc, b) => acc + Number(b[key] || 0), 0);
  const totalsOf = (arr) => ({
    reservas: arr.length,
    ingressos: sumBy(arr, 'ticketsCount'),
    receita: sumBy(arr, 'totalAmount'),
    taxas: sumBy(arr, 'diskFeeAmount')
  });
  const cur = totalsOf(curBookings);
  const prev = totalsOf(prevBookings);

  const deltaOf = (c, p) => {
    if (!p) return { change: '—', sub: 'sem período ant.', tone: 'neutral' };
    const pct = Math.round(((c - p) / p) * 100);
    return {
      change: `${pct >= 0 ? '↑ +' : '↓ '}${pct}%`,
      sub: 'vs. período ant.',
      tone: pct >= 0 ? 'up' : 'down'
    };
  };

  const activeAgencies = agencies.filter((a) => a.status === 'Ativa');
  const statesServed = new Set(activeAgencies.map((a) => a.state).filter(Boolean)).size;

  const kpis = [
    { label: 'Agências Ativas', value: brNum(activeAgencies.length), change: `${agencies.length} total`, sub: 'cadastradas', tone: 'neutral', color: 'bg-blue-600' },
    { label: 'Estados Atendidos', value: brNum(statesServed), change: `${statesServed} de 27`, sub: 'UFs', tone: 'neutral', color: 'bg-emerald-600' },
    { label: 'Reservas B2B', value: brNum(cur.reservas), ...deltaOf(cur.reservas, prev.reservas), color: 'bg-purple-600' },
    { label: 'Ingressos Distribuídos', value: brNum(cur.ingressos), ...deltaOf(cur.ingressos, prev.ingressos), color: 'bg-amber-500' },
    { label: 'Receita Bruta', value: brl(cur.receita), ...deltaOf(cur.receita, prev.receita), color: 'bg-teal-600' },
    { label: 'Taxas DiskIngressos', value: brl(cur.taxas), change: `${feePct}% contratado`, sub: 'Repasse PDT', tone: 'neutral', color: 'bg-rose-600' }
  ];
  const toneClass = {
    up: 'text-emerald-700 bg-emerald-50 border-emerald-200/70',
    down: 'text-rose-700 bg-rose-50 border-rose-200/70',
    neutral: 'text-slate-700 bg-slate-50 border-slate-200'
  };

  // Origem dos turistas (UF extraída de originCity, ponderada por ingressos)
  const UF_NAMES = { AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins' };
  const FALLBACK_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const ufOf = (b) => {
    const city = String(b.originCity || '');
    return city.includes('-') ? city.split('-').pop().trim().toUpperCase().slice(0, 2) : '';
  };
  const ufTotals = {};
  curBookings.forEach((b) => {
    const uf = ufOf(b);
    if (uf) ufTotals[uf] = (ufTotals[uf] || 0) + Number(b.ticketsCount || 0);
  });
  const ufTotal = Object.values(ufTotals).reduce((a, b) => a + b, 0);
  const ufSorted = Object.entries(ufTotals).sort((a, b) => b[1] - a[1]);
  const stateStats = ufSorted.slice(0, 5).map(([uf, qty], i) => {
    const ref = STATE_ORIGIN_DATA.find((s) => s.uf === uf);
    return {
      uf,
      state: UF_NAMES[uf] || uf,
      share: Math.round((qty / ufTotal) * 100),
      color: ref?.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
    };
  });
  const othersQty = ufSorted.slice(5).reduce((a, [, q]) => a + q, 0);
  if (othersQty > 0) {
    stateStats.push({ uf: 'BR', state: 'Outros Estados', share: Math.round((othersQty / ufTotal) * 100), color: '#94a3b8' });
  }
  let donutOffset = 0;
  const donutSegments = stateStats.map((st) => {
    const seg = { ...st, offset: -donutOffset };
    donutOffset += st.share;
    return seg;
  });

  // Evolução: 5 faixas iguais dentro do período
  const evoBuckets = Array.from({ length: 5 }, (_, i) => ({
    d: fmtDay(startTs + Math.floor((i * spanDays) / 5) * DAY),
    reservas: 0,
    ingressos: 0
  }));
  curBookings.forEach((b) => {
    const dayIdx = Math.round((toTs(dateOf(b)) - startTs) / DAY);
    const idx = Math.min(4, Math.floor((dayIdx * 5) / spanDays));
    evoBuckets[idx].reservas += 1;
    evoBuckets[idx].ingressos += Number(b.ticketsCount || 0);
  });
  const maxReservas = Math.max(1, ...evoBuckets.map((x) => x.reservas));
  const maxIngressos = Math.max(1, ...evoBuckets.map((x) => x.ingressos));
  const evolution = evoBuckets.map((x) => ({
    d: x.d,
    r: x.reservas ? Math.max(8, Math.round((x.reservas / maxReservas) * 100)) : 0,
    i: x.ingressos ? Math.max(8, Math.round((x.ingressos / maxIngressos) * 100)) : 0,
    val: brNum(x.ingressos)
  }));

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

  const handleCopyAgencyLink = (ag) => {
    navigator.clipboard?.writeText(
      `https://rua-da-musica-agencia.vercel.app/?agency=${ag.id}`
    );
    setCopiedAgencyId(ag.id);
    setTimeout(() => setCopiedAgencyId(null), 2000);
  };

  const handleToggleAgencyStatus = (ag) => {
    const nextStatus = ag.status === 'Ativa' ? 'Pendente' : 'Ativa';
    setAgencyOverrides((prev) => ({
      ...prev,
      [ag.id]: { ...(prev[ag.id] || {}), status: nextStatus }
    }));
  };

  const handleCreateTicketType = (e) => {
    e.preventDefault();
    if (!newTicketForm.name) return;
    const base = Number(newTicketForm.basePrice) || 30;
    const fee = (base * feePct) / 100;
    const created = {
      id: `TKT-CUSTOM-${Date.now().toString().slice(-4)}`,
      name: newTicketForm.name,
      description: newTicketForm.description || 'Tarifa B2B credenciada',
      basePrice: base,
      diskFee: fee,
      agencyPrice: base + fee,
      status: 'Ativo',
      iconType: 'ticket'
    };
    setTicketCatalog((prev) => [...prev, created]);
    setNewTicketForm({ name: '', description: '', basePrice: 40 });
    setShowNewTicketModal(false);
  };

  const handleScannerSubmit = (e) => {
    e.preventDefault();
    const q = scannerCode.trim().toUpperCase();
    if (!q) return;
    const found = bookingsList.find(
      (b) =>
        String(b.id).toUpperCase().includes(q) ||
        String(b.qrCode || '').toUpperCase().includes(q) ||
        String(b.groupName || '').toUpperCase().includes(q)
    );
    if (!found) {
      setScannerFeedback({
        ok: false,
        text: `Nenhum voucher localizado para "${scannerCode}". Verifique o código B2B.`
      });
      return;
    }
    if (onCheckinVoucher) {
      onCheckinVoucher(found.id, true);
    }
    setScannerFeedback({
      ok: true,
      text: `Check-in validado na catraca: ${found.id} • ${found.groupName} (${found.ticketsCount} visitantes liberados).`
    });
    setScannerCode('');
  };

  const handleIssuePdvTicket = (e) => {
    e.preventDefault();
    const qty = Math.max(1, Number(pdvForm.qty) || 1);
    const total = qty * (Number(pdvForm.unitPrice) || 30);
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const sale = {
      id: `PDV-${Math.floor(8842 + Math.random() * 900)}`,
      time: now,
      booth: pdvForm.booth,
      item: `${qty}x ${pdvForm.ticketType.split('—')[0].trim()}`,
      payment: pdvForm.payment,
      total
    };
    setPdvSales((prev) => [sale, ...prev]);
  };

  const handleExportCsv = (filename, headers, rows) => {
    const csvContent = [
      headers.join(';'),
      ...rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBookings = bookingsList.filter((b) => {
    const matchText =
      String(b.id || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
      String(b.groupName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
      String(b.agencyName || '').toLowerCase().includes(bookingSearch.toLowerCase());
    const matchStatus = bookingStatusFilter === 'Todos' || b.status === bookingStatusFilter;
    return matchText && matchStatus;
  });

  const sidebarItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'estoque', label: 'Ingressos & Estoque', icon: Ticket },
    { id: 'bilheteria', label: 'Bilheteria Local', icon: Store },
    { id: 'tarifario', label: 'Distribuição Turística', icon: Briefcase },
    { id: 'agencias', label: 'Agências', icon: Building2 },
    { id: 'reservas', label: 'Reservas', icon: CalendarCheck },
    { id: 'vouchers', label: 'Vouchers & Catraca', icon: QrCode },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const subTabs = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'estoque', label: 'Estoque & Canais' },
    { id: 'bilheteria', label: 'Bilheteria Local' },
    { id: 'agencias', label: 'Agências' },
    { id: 'tarifario', label: 'Tarifário B2B' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'vouchers', label: 'Vouchers & Catraca' },
    { id: 'comissoes', label: 'Comissões' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'configuracoes', label: 'Configurações' }
  ];

  const activeTabLabel =
    subTabs.find((t) => t.id === activeTab)?.label ||
    sidebarItems.find((s) => s.id === activeTab)?.label ||
    'Visão Geral';

  return (
    <div className="flex-1 flex flex-col xl:flex-row bg-[#f8fafc]">
      {/* Left Sidebar (Matching 11_26_17.png & video) */}
      <aside className="w-full xl:w-64 bg-white border-b xl:border-b-0 xl:border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="h-28 relative">
              <img
                src="/assets/vale-palco-flutuante.jpg"
                alt="Parque Jaime Lerner - Vale da Música"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute top-2 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs">
                <img
                  src="/assets/logo-vale-color-h.png"
                  alt="Vale da Música"
                  className="h-4 w-auto object-contain"
                />
              </div>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-slate-900/85 text-white text-[9px] font-bold uppercase tracking-wider">
                PARQUE CULTURAL
              </span>
            </div>
            <div className="p-3">
              <h2 className="font-bold text-sm text-slate-900">Parque Jaime Lerner</h2>
              <p className="text-[11px] text-slate-500">Vale da Música • Curitiba - PR</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
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
              src="/assets/vale-natureza-neon.jpg"
              alt="Vale da Música - Natureza"
              className="w-16 h-20 rounded-lg object-cover object-center shrink-0 border border-slate-200"
            />
            <div className="space-y-1.5 min-w-0">
              <div className="text-[10px] font-bold text-blue-800 tracking-wider uppercase leading-relaxed">
                MÚSICA<br />ARTE<br />NATUREZA<br />CURITIBA
              </div>
              <img
                src="/assets/logo-vale-ondas.png"
                alt="Ondas Vale da Música"
                className="h-3 w-24 object-contain object-left"
              />
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
              <span className="text-slate-700 font-semibold">{activeTabLabel}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {activeTab === 'visao-geral'
                ? 'Distribuição Turística B2B'
                : `Distribuição Turística B2B — ${activeTabLabel}`}
            </h1>
            <p className="text-xs text-slate-500">
              Venda de ingressos, controle de estoque, catraca e conciliação para agências de turismo.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <span>📅</span>
              <input
                type="date"
                value={periodStart}
                max={periodEnd}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
              <span>-</span>
              <input
                type="date"
                value={periodEnd}
                min={periodStart}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
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
            {/* 6 KPI Cards — dados reais do período selecionado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 auto-rows-fr">
              {kpis.map((kpi, idx) => (
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
                    <span className="text-xs font-bold text-slate-800 leading-tight">{kpi.label}</span>
                  </div>
                  <div className="text-lg font-mono font-bold tabular-nums tracking-tighter text-slate-950 whitespace-nowrap overflow-hidden text-ellipsis">
                    {kpi.value}
                  </div>
                  <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] h-7">
                    <span className={`font-bold tabular-nums border px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${toneClass[kpi.tone]}`}>
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
                  {stateStats.map((st) => (
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
                  <span className="text-[11px] font-medium text-slate-600">{spanDays} dias no período</span>
                </div>

                <div className="my-4 h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
                  {evolution.map((bar, bi) => (
                    <div key={bi} className="flex-1 flex flex-col items-center gap-1.5">
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
                      {donutSegments.map((seg) => (
                        <circle
                          key={seg.uf}
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="4.5"
                          pathLength="100"
                          strokeDasharray={`${seg.share} ${100 - seg.share}`}
                          strokeDashoffset={seg.offset}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-sm font-bold tabular-nums text-slate-950 leading-none">
                        {brNum(cur.ingressos)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                        ingressos
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs flex-1">
                    {stateStats.map((st) => (
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
                  Principal emissor: <strong className="font-bold">{stateStats[0] ? `${stateStats[0].state} (${stateStats[0].share}%)` : 'sem dados no período'}</strong>
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
                            <button
                              type="button"
                              onClick={() => setSelectedAgencyDetail(ag)}
                              title="Ver Detalhes da Agência"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-600 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyAgencyLink(ag)}
                              title="Copiar Link B2B da Agência"
                              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                                copiedAgencyId === ag.id
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Link2 className="w-3.5 h-3.5" />
                              {copiedAgencyId === ag.id && <span>Copiado!</span>}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAgencyStatus(ag)}
                              title="Alternar Status (Ativa / Pendente)"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            >
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

        {/* TAB: INGRESSOS & ESTOQUE (Gestão de Capacidade & Alocação por Canal) */}
        {activeTab === 'estoque' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
              {[
                {
                  label: 'Capacidade Diária Total',
                  val: `${brNum(channelQuotas.site + channelQuotas.bilheteria + channelQuotas.b2b)} ingressos`,
                  badge: 'Estoque Único PDT',
                  color: 'bg-blue-600'
                },
                {
                  label: 'Alocação Site Online (B2C)',
                  val: `${brNum(channelQuotas.site)} ing.`,
                  badge: '50% da carga',
                  color: 'bg-emerald-600'
                },
                {
                  label: 'Alocação Bilheteria Física',
                  val: `${brNum(channelQuotas.bilheteria)} ing.`,
                  badge: 'Guichês & Totens',
                  color: 'bg-amber-500'
                },
                {
                  label: 'Cota Agências B2B',
                  val: `${brNum(channelQuotas.b2b)} ing.`,
                  badge: `${brNum(cur.ingressos)} vendidos`,
                  color: 'bg-purple-600'
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 p-4 shadow-xs flex flex-col justify-between h-[120px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{card.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${card.color}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-slate-950">{card.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Controle de Distribuição por Canal */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                     Balanceamento de Estoque por Canal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajuste em tempo real a distribuição de lotes entre E-commerce, Bilheteria e B2B
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Site Oficial (B2C Online)</span>
                      <span className="font-mono text-blue-600">{channelQuotas.site} ing./dia</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={2500}
                      step={50}
                      value={channelQuotas.site}
                      onChange={(e) =>
                        setChannelQuotas({ ...channelQuotas, site: Number(e.target.value) })
                      }
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Bilheteria Local & Totens</span>
                      <span className="font-mono text-amber-600">{channelQuotas.bilheteria} ing./dia</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={1500}
                      step={50}
                      value={channelQuotas.bilheteria}
                      onChange={(e) =>
                        setChannelQuotas({ ...channelQuotas, bilheteria: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Portal de Agências B2B & Excursões</span>
                      <span className="font-mono text-purple-600">{channelQuotas.b2b} ing./dia</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={1500}
                      step={50}
                      value={channelQuotas.b2b}
                      onChange={(e) =>
                        setChannelQuotas({ ...channelQuotas, b2b: Number(e.target.value) })
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Ocupação por Faixa Horária */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Ocupação de Visitantes por Faixa Horária (Slots)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Controle de grupos agendados para evitar filas no acesso à Ópera de Arame
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                        <th className="py-2.5 px-3">Slot Horário</th>
                        <th className="py-2.5 px-3 text-right">Capacidade Slot</th>
                        <th className="py-2.5 px-3 text-right">Grupos B2B</th>
                        <th className="py-2.5 px-3 text-right">Saldo Livre</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { time: '09:00', cap: 350, b2b: 95, status: 'Disponível' },
                        { time: '10:00', cap: 350, b2b: 140, status: 'Disponível' },
                        { time: '11:00', cap: 350, b2b: 80, status: 'Disponível' },
                        { time: '14:00', cap: 350, b2b: 210, status: 'Alta Procura' },
                        { time: '15:00', cap: 350, b2b: 110, status: 'Disponível' },
                        { time: '16:00', cap: 350, b2b: 65, status: 'Disponível' }
                      ].map((s) => (
                        <tr key={s.time} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.time}</td>
                          <td className="py-2.5 px-3 text-right font-semibold">{s.cap} pax</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-600">{s.b2b} pax</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            {s.cap - s.b2b} vagas
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                s.status === 'Disponível'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BILHETERIA LOCAL (PDV Físico do Parque Jaime Lerner) */}
        {activeTab === 'bilheteria' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Emissor PDV */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  FRENTE DE CAIXA • PARQUE JAIME LERNER
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Emissão Rápida — Bilheteria Local (PDV)
                </h3>
                <p className="text-xs text-slate-500">
                  Venda presencial integrada ao mesmo estoque centralizado das agências B2B
                </p>
              </div>

              <form onSubmit={handleIssuePdvTicket} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ponto de Venda / Guichê</label>
                  <select
                    value={pdvForm.booth}
                    onChange={(e) => setPdvForm({ ...pdvForm, booth: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  >
                    <option>Guichê 01 — Entrada Principal</option>
                    <option>Guichê 02 — Prioridade / Meia</option>
                    <option>Totem Autoatendimento 01</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidade de Ingresso</label>
                  <select
                    value={pdvForm.ticketType}
                    onChange={(e) => {
                      const val = e.target.value;
                      const price = val.includes('15,00') ? 15 : val.includes('45,00') ? 45 : 30;
                      setPdvForm({ ...pdvForm, ticketType: val, unitPrice: price });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  >
                    <option>Ingresso Parque (Inteira) — R$ 30,00</option>
                    <option>Ingresso Meia-Entrada — R$ 15,00</option>
                    <option>Visita + Tour Guiado — R$ 45,00</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quantidade</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={pdvForm.qty}
                      onChange={(e) => setPdvForm({ ...pdvForm, qty: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pagamento no Guichê</label>
                    <select
                      value={pdvForm.payment}
                      onChange={(e) => setPdvForm({ ...pdvForm, payment: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    >
                      <option>PIX QR Dinâmico</option>
                      <option>Cartão de Débito</option>
                      <option>Cartão de Crédito</option>
                      <option>Espécie (Dinheiro)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total a Cobrar no Guichê:</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-700">
                    {brl((Number(pdvForm.qty) || 1) * (Number(pdvForm.unitPrice) || 30))}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Emitir Ingresso & Liberar Catraca
                </button>
              </form>
            </div>

            {/* Últimas Emissões de Balcão */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Últimas Vendas na Bilheteria Física
                  </h3>
                  <p className="text-xs text-slate-500">
                    Histórico em tempo real dos guichês presenciais e totens de autoatendimento
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● 3 Caixas Abertos
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Ticket</th>
                      <th className="py-2.5 px-3">Horário</th>
                      <th className="py-2.5 px-3">Guichê / Terminal</th>
                      <th className="py-2.5 px-3">Itens</th>
                      <th className="py-2.5 px-3">Pagamento</th>
                      <th className="py-2.5 px-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pdvSales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">{s.id}</td>
                        <td className="py-3 px-3 text-slate-600">{s.time}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{s.booth}</td>
                        <td className="py-3 px-3 text-slate-700">{s.item}</td>
                        <td className="py-3 px-3 text-slate-600">{s.payment}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {brl(s.total)}
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
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
                    <th className="py-3 px-3 text-center">Ações</th>
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
                      <td className="py-3.5 px-3 text-right font-semibold">{ag.quotaLimit}</td>
                      <td className="py-3.5 px-3 text-right">{ag.bookingsCount}</td>
                      <td className="py-3.5 px-3 text-right font-bold">{ag.ticketsSold}</td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        R$ {ag.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAgencyDetail(ag)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600 font-semibold cursor-pointer"
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAgencyStatus(ag)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                          >
                            {ag.status === 'Ativa' ? 'Pausar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TARIFÁRIO B2B & SIMULADOR */}
        {activeTab === 'tarifario' && (
          <div className="space-y-6">
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
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Catálogo de Ingressos Ativos</h3>
                    <p className="text-xs text-slate-500">
                      Valores comercializados pelo Parque Jaime Lerner no canal B2B
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
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
                    {ticketCatalog.map((t) => {
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

        {/* TAB 4: RESERVAS B2B */}
        {activeTab === 'reservas' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reservas de Grupos & Excursões B2B
                </h3>
                <p className="text-xs text-slate-500">
                  Gestão de reservas de agências credenciadas, confirmação de lotes e acompanhamento de grupos
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar grupo, código ou agência..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="bg-transparent focus:outline-none text-slate-800 w-52"
                  />
                </div>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="Voucher emitido">Voucher emitido</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pré-reserva">Pré-reserva</option>
                  <option value="Concluído">Concluído</option>
                </select>
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
                  {filteredBookings.map((b) => (
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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            b.status === 'Concluído'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : b.status === 'Pré-reserva'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
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

        {/* TAB 5: VOUCHERS & CATRACA (Validador QR Code + Check-in em Lote) */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            {/* Barra de Leitura / Validação Rápida na Catraca */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  CONTROLE DE ACESSO • CATRACAS ÓPERA DE ARAME
                </span>
                <h3 className="text-base font-extrabold">
                  Validador de Voucher B2B & Check-in por QR Code
                </h3>
                <p className="text-xs text-slate-300">
                  Bipe o QR Code do guia/coordenador ou digite o código da reserva para liberar a catraca em lote
                </p>
              </div>

              <form onSubmit={handleScannerSubmit} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Ex: RES-B2B-1049 ou DISK-RES-B2B..."
                  value={scannerCode}
                  onChange={(e) => setScannerCode(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-400 w-64 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Validar na Catraca</span>
                </button>
              </form>
            </div>

            {scannerFeedback && (
              <div
                className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between border ${
                  scannerFeedback.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span>{scannerFeedback.text}</span>
                <button
                  type="button"
                  onClick={() => setScannerFeedback(null)}
                  className="text-xs underline ml-4 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* Tabela de Vouchers para Check-in na Catraca */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fila de Vouchers de Grupos & Status da Catraca
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acione o check-in diretamente para registrar a entrada da excursão no parque
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    Concluídos: {bookingsList.filter((b) => b.status === 'Concluído').length}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    Aguardando Entrada: {bookingsList.filter((b) => b.status !== 'Concluído').length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-3">QR Code / Reserva</th>
                      <th className="py-3 px-3">Grupo / Coordenador</th>
                      <th className="py-3 px-3">Agência</th>
                      <th className="py-3 px-3">Data & Slot</th>
                      <th className="py-3 px-3 text-center">Visitantes</th>
                      <th className="py-3 px-3 text-center">Status Catraca</th>
                      <th className="py-3 px-3 text-center">Operação na Catraca</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookingsList.map((b) => {
                      const isDone = b.status === 'Concluído';
                      return (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3">
                            <div className="font-mono font-bold text-slate-900">
                              {b.qrCode || `DISK-${b.id}-PJL`}
                            </div>
                            <div className="text-[11px] font-mono text-blue-600">{b.id}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900">{b.groupName}</div>
                            <div className="text-[11px] text-slate-400">{b.coordinator}</div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700">{b.agencyName}</td>
                          <td className="py-3.5 px-3 text-slate-700">
                            {b.visitDate} às {b.visitTime}
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                            {b.ticketsCount} pax
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {isDone ? '✓ Check-in Realizado' : b.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onCheckinVoucher && onCheckinVoucher(b.id, !isDone)
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                                  isDone
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                {isDone ? 'Reabrir' : 'Validar Entrada'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenVoucher && onOpenVoucher(b)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                              >
                                Voucher
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: COMISSÕES & RETENÇÕES */}
        {activeTab === 'comissoes' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Apuração de Taxa Administrativa & Comissões B2B
                </h3>
                <p className="text-xs text-slate-500">
                  Demonstrativo analítico da retenção contratual DiskIngressos ({feePct.toFixed(1)}%) por reserva emitida
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleExportCsv(
                    'comissoes_b2b_parque_jaime_lerner.csv',
                    ['Reserva', 'Agencia', 'Grupo', 'Ingressos', 'Base Parque', 'Taxa Disk', 'Total B2B'],
                    bookingsList.map((b) => [
                      b.id,
                      b.agencyName,
                      b.groupName,
                      b.ticketsCount,
                      b.baseAmount.toFixed(2),
                      b.diskFeeAmount.toFixed(2),
                      b.totalAmount.toFixed(2)
                    ])
                  )
                }
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Exportar Planilha de Comissões (.CSV)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-3">Reserva</th>
                    <th className="py-3 px-3">Agência Parceira</th>
                    <th className="py-3 px-3 text-center">Ingressos</th>
                    <th className="py-3 px-3 text-right">Base Parque (94%)</th>
                    <th className="py-3 px-3 text-right">Taxa Adm. Disk (6%)</th>
                    <th className="py-3 px-3 text-right">Total B2B Faturado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">{b.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.agencyName}</td>
                      <td className="py-3 px-3 text-center font-bold">{b.ticketsCount}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                        {brl(b.baseAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                        {brl(b.diskFeeAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-900">
                        {brl(b.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: FINANCEIRO (Conciliação, Split & Repasses ao Parque) */}
        {activeTab === 'financeiro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">
                  Faturamento Bruto B2B (Período)
                </span>
                <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">
                  {brl(cur.receita)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {cur.reservas} reservas contabilizadas no período
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-xs font-semibold text-emerald-700 block">
                  Repasse Líquido Parque Jaime Lerner
                </span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 mt-1 block">
                  {brl(cur.receita - cur.taxas)}
                </span>
                <span className="text-[11px] text-emerald-600 mt-1 block">
                  100% do preço-base garantido no split PDT
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs">
                <span className="text-xs font-semibold text-blue-700 block">
                  Retenção Taxa Adm. DiskIngressos ({feePct.toFixed(1)}%)
                </span>
                <span className="text-2xl font-mono font-extrabold text-blue-700 mt-1 block">
                  {brl(cur.taxas)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Retida automaticamente na liquidação B2B
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Extrato de Conciliação & Borderô de Repasses (Ledger PDT)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rastreabilidade por lote de reserva com separação automática entre valor-base do Parque e taxa DiskIngressos
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleExportCsv(
                      'bordero_financeiro_pdt.csv',
                      ['Codigo', 'Data Visita', 'Agencia', 'Repasse Liquido Parque', 'Taxa Disk', 'Total Bruto', 'Status'],
                      curBookings.map((b) => [
                        b.id,
                        b.visitDate,
                        b.agencyName,
                        b.baseAmount.toFixed(2),
                        b.diskFeeAmount.toFixed(2),
                        b.totalAmount.toFixed(2),
                        b.status
                      ])
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Baixar Borderô Financeiro (.CSV)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-3">Reserva</th>
                      <th className="py-3 px-3">Data</th>
                      <th className="py-3 px-3">Agência</th>
                      <th className="py-3 px-3 text-right">Repasse Parque</th>
                      <th className="py-3 px-3 text-right">Taxa Disk (6%)</th>
                      <th className="py-3 px-3 text-right">Total Liquidado</th>
                      <th className="py-3 px-3 text-center">Conciliação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {curBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">{b.id}</td>
                        <td className="py-3 px-3 text-slate-600">{b.visitDate}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{b.agencyName}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                          {brl(b.baseAmount)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {brl(b.diskFeeAmount)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-900">
                          {brl(b.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Conciliado PDT
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: RELATÓRIOS GERENCIAIS & BI */}
        {activeTab === 'relatorios' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Ranking de Agências */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Ranking de Agências por Receita B2B
                    </h3>
                    <p className="text-xs text-slate-500">
                      Desempenho acumulado das agências credenciadas
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleExportCsv(
                        'ranking_agencias_b2b.csv',
                        ['Agencia', 'CNPJ', 'Cidade/UF', 'Reservas', 'Ingressos', 'Receita B2B'],
                        agencies.map((a) => [
                          a.name,
                          a.cnpj,
                          a.cityUf,
                          a.bookingsCount,
                          a.ticketsSold,
                          a.revenue
                        ])
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer"
                  >
                    Exportar CSV
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {[...agencies]
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((ag, idx) => (
                      <div
                        key={ag.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{ag.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {ag.cityUf} • {ag.ticketsSold} ingressos
                            </div>
                          </div>
                        </div>
                        <span className="font-mono font-extrabold text-slate-900">
                          {brl(ag.revenue)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Origem Regional por Estado (UF) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Fluxo Turístico por Estado Emissor (UF)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Participação regional nas excursões recebidas pelo Parque Jaime Lerner
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {stateStats.map((st) => (
                    <div
                      key={st.uf}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>
                          {st.state} ({st.uf})
                        </span>
                        <span className="font-mono text-blue-700">{st.share}% do fluxo</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${st.share}%`, backgroundColor: st.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CONFIGURAÇÕES OPERACIONAIS DO PARQUE */}
        {activeTab === 'configuracoes' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configurações Operacionais — Parque Jaime Lerner & Canal B2B
              </h3>
              <p className="text-xs text-slate-500">
                Regras de capacidade diária, expiração de pré-reservas (HELD) e parâmetros de catraca
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Capacidade Diária Total do Parque (Visitantes)
                </label>
                <input
                  type="number"
                  value={parkSettings.dailyCapacity}
                  onChange={(e) =>
                    setParkSettings({ ...parkSettings, dailyCapacity: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cota Diária Máxima para Agências B2B
                </label>
                <input
                  type="number"
                  value={parkSettings.b2bMaxQuota}
                  onChange={(e) =>
                    setParkSettings({ ...parkSettings, b2bMaxQuota: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Validade de Pré-Reserva B2B (Horas em HELD)
                </label>
                <input
                  type="number"
                  value={parkSettings.holdExpirationHours}
                  onChange={(e) =>
                    setParkSettings({
                      ...parkSettings,
                      holdExpirationHours: Number(e.target.value)
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Limite de Crédito Faturado Padrão (R$)
                </label>
                <input
                  type="number"
                  value={parkSettings.defaultCreditLimit}
                  onChange={(e) =>
                    setParkSettings({
                      ...parkSettings,
                      defaultCreditLimit: Number(e.target.value)
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parkSettings.batchQrCheckin}
                  onChange={(e) =>
                    setParkSettings({ ...parkSettings, batchQrCheckin: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">
                  Permitir Check-in em Lote por QR Code Único do Guia/Coordenador
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parkSettings.autoTurnstileSync}
                  onChange={(e) =>
                    setParkSettings({ ...parkSettings, autoTurnstileSync: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">
                  Sincronizar baixa de vouchers instantaneamente com as catracas da Ópera de Arame
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setParkSettings({ ...parkSettings, savedSuccess: true });
                  setTimeout(
                    () => setParkSettings((prev) => ({ ...prev, savedSuccess: false })),
                    3000
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Salvar Configurações Operacionais
              </button>
              {parkSettings.savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  ✓ Configurações salvas com sucesso!
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Detalhes da Agência Parceira */}
      {selectedAgencyDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  FICHA DE CREDENCIAMENTO B2B
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAgencyDetail.name}
                </h3>
                <p className="text-slate-500">
                  CNPJ: {selectedAgencyDetail.cnpj} • {selectedAgencyDetail.cityUf}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedAgencyDetail.status === 'Ativa'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                ● {selectedAgencyDetail.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Cota Mensal</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedAgencyDetail.quotaLimit} ing.
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Reservas Emitidas</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedAgencyDetail.bookingsCount} grupos
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Ingressos Vendidos</span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {selectedAgencyDetail.ticketsSold} pax
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Receita B2B Gerada</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {brl(selectedAgencyDetail.revenue)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyAgencyLink(selectedAgencyDetail)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 cursor-pointer"
              >
                {copiedAgencyId === selectedAgencyDetail.id ? 'Link Copiado!' : 'Copiar Link B2B'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgencyDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Tipo de Ingresso B2B */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Adicionar Produto ao Catálogo B2B
            </h3>
            <form onSubmit={handleCreateTicketType} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Produto / Ingresso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Combo Ópera de Arame + Palco Flutuante VIP"
                  value={newTicketForm.name}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição Comercial</label>
                <input
                  type="text"
                  placeholder="Ex: Acesso prioritário + recepção para grupos"
                  value={newTicketForm.description}
                  onChange={(e) =>
                    setNewTicketForm({ ...newTicketForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preço-Base do Parque (R$)</label>
                <input
                  type="number"
                  min={1}
                  value={newTicketForm.basePrice}
                  onChange={(e) =>
                    setNewTicketForm({ ...newTicketForm, basePrice: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  Adicionar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
