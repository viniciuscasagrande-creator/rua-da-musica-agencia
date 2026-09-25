import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  Ticket,
  Award,
  Link as LinkIcon,
  Tag,
  Plus,
  Search,
  Filter,
  Eye,
  Share2,
  Send,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const PromoterModule = () => {
  const [activeTab, setActiveTab] = useState('promoters');
  const [tableFilter, setTableFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPromoterOpen, setIsAddPromoterOpen] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [promotersList, setPromotersList] = useState([
    { id: 1, name: 'João Silva', phone: '(41) 99999-1234', status: 'Ativo', type: 'Promoter', sales: 284, tickets: 312, revenue: 31400.00, target: 300, progress: 94, commission: 1570.00, conv: '8,6%', initials: 'JS', bg: 'bg-purple-600', link: 'parquejaimelerner.com.br/p/joao-silva' },
    { id: 2, name: 'Maria Souza', phone: '(41) 98888-5678', status: 'Ativo', type: 'Promoter', sales: 241, tickets: 268, revenue: 27850.00, target: 300, progress: 80, commission: 1392.00, conv: '7,9%', initials: 'MS', bg: 'bg-indigo-600', link: 'parquejaimelerner.com.br/p/maria-souza' },
    { id: 3, name: 'Pedro Lima', phone: '(41) 97777-9012', status: 'Ativo', type: 'Divulgador', sales: 198, tickets: 221, revenue: 22600.00, target: 250, progress: 79, commission: 1130.00, conv: '6,8%', initials: 'PL', bg: 'bg-blue-600', link: 'parquejaimelerner.com.br/p/pedro-lima' },
    { id: 4, name: 'Ana Costa', phone: '(41) 96666-3456', status: 'Pausado', type: 'Promoter', sales: 156, tickets: 174, revenue: 18240.00, target: 200, progress: 78, commission: 912.00, conv: '6,1%', initials: 'AC', bg: 'bg-orange-500', link: 'parquejaimelerner.com.br/p/ana-costa' },
    { id: 5, name: 'Lucas Ribeiro', phone: '(41) 95555-7890', status: 'Ativo', type: 'Divulgador', sales: 132, tickets: 148, revenue: 15380.00, target: 150, progress: 88, commission: 752.00, conv: '5,7%', initials: 'LR', bg: 'bg-purple-700', link: 'parquejaimelerner.com.br/p/lucas-ribeiro' },
  ]);

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = (promoter) => {
    const link = `https://${promoter.link || 'parquejaimelerner.com.br/p/' + promoter.name.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard?.writeText?.(link);
    notify(`Link rastreável copiado: ${link}`);
  };

  const handleWhatsApp = (promoter) => {
    const text = encodeURIComponent(`Olá ${promoter.name}! Segue o acompanhamento das suas vendas no Parque Jaime Lerner. Seu link de afiliado: https://${promoter.link}`);
    window.open(`https://wa.me/55${promoter.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleCreatePromoter = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.promoterName.value;
    const phone = form.promoterPhone.value;
    const type = form.promoterType.value;
    const target = Number(form.promoterTarget.value) || 200;

    const newP = {
      id: Date.now(),
      name,
      phone,
      status: 'Ativo',
      type,
      sales: 0,
      tickets: 0,
      revenue: 0,
      target,
      progress: 0,
      commission: 0,
      conv: '0,0%',
      initials: name.substring(0, 2).toUpperCase(),
      bg: type === 'Promoter' ? 'bg-purple-600' : 'bg-blue-600',
      link: `parquejaimelerner.com.br/p/${name.toLowerCase().replace(/\s+/g, '-')}`
    };

    setPromotersList(prev => [newP, ...prev]);
    setIsAddPromoterOpen(false);
    notify(`${type} "${name}" cadastrado com sucesso! Link rastreável ativado.`);
  };

  const filteredPromoters = promotersList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.phone.includes(searchQuery);
    if (tableFilter === 'Todos') return matchesSearch;
    if (tableFilter === 'Promoters') return matchesSearch && p.type === 'Promoter';
    if (tableFilter === 'Divulgadores') return matchesSearch && p.type === 'Divulgador';
    if (tableFilter === 'Ativos') return matchesSearch && p.status === 'Ativo';
    if (tableFilter === 'Pausados') return matchesSearch && p.status === 'Pausado';
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span>Eventos</span>
            <span>&gt;</span>
            <span>ID 3822</span>
            <span>&gt;</span>
            <span>Equipe de Vendas</span>
            <span>&gt;</span>
            <span className="text-slate-700 font-semibold">Promoters</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Equipe de Vendas</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie sua equipe de promoters, divulgadores, links, cupons, metas e comissões.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs">
            <span>📅 01/09/2026 - 30/09/2026</span>
          </div>
          <button
            onClick={() => setIsAddPromoterOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Promoter</span>
          </button>
        </div>
      </div>

      {/* 6 Top KPIs matching screenshot 10_27_42 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Vendas da Equipe</span>
          </div>
          <div className="text-2xl font-black text-slate-900">1.482</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18% <span className="font-normal text-slate-400">Ingressos</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Receita Gerada</span>
          </div>
          <div className="text-2xl font-black text-slate-900">R$ 184.320,00</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +22% <span className="font-normal text-slate-400">Total vendas</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Promoters Ativos</span>
          </div>
          <div className="text-2xl font-black text-slate-900">23</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +9% <span className="font-normal text-slate-400">de 28 cad.</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Conversão</span>
          </div>
          <div className="text-2xl font-black text-slate-900">8,4%</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +2,1% <span className="font-normal text-slate-400">Visitas-compra</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Ticket Médio</span>
          </div>
          <div className="text-2xl font-black text-slate-900">R$ 124,40</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +6% <span className="font-normal text-slate-400">Por pedido</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Comissões</span>
          </div>
          <div className="text-2xl font-black text-rose-600">R$ 9.216,00</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18% <span className="font-normal text-slate-400">Total devido</span>
          </span>
        </div>
      </div>

      {/* Middle Grid: Top 5 Ranking, Evolution, Ticket Type Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Top 5 Promoters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800">Vendas por Promoter (Top 5)</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Ingressos</span>
          </div>

          <div className="space-y-3">
            {promotersData.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3 text-xs">
                <span className="font-black text-slate-400 w-3">{idx + 1}</span>
                <div className={`w-7 h-7 rounded-lg ${p.bg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                  {p.initials}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className="font-bold text-slate-900">{p.sales}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(p.sales / 300) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Evolution Line Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-800">Evolução de Vendas</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Últimos 30 dias</span>
          </div>

          <div className="flex justify-center gap-4 text-xs mb-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded-sm" /> Vendas</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-500 rounded-sm" /> Receita (R$)</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-2 px-2 pt-4 border-b border-slate-100">
            {[45, 60, 52, 78, 65, 92, 85, 110, 105, 140, 130, 168].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500/80 rounded-t" style={{ height: `${h}px` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
            <span>01/09</span>
            <span>10/09</span>
            <span>20/09</span>
          </div>
        </div>

        {/* Ticket Type Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-800 mb-2">Distribuição por Tipo de Ingresso</h3>

          <div className="flex items-center justify-around">
            <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-slate-900">1.482</span>
              <span className="text-[10px] text-slate-400">vendas</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Pista</span>
                <span className="font-bold">52%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> VIP</span>
                <span className="font-bold">28%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Camarote</span>
                <span className="font-bold">12%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Premium</span>
                <span className="font-bold">6%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Outros</span>
                <span className="font-bold">2%</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-[11px] flex items-center gap-2 mt-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Promoters com meta ativa vendem em média 3x mais!</span>
          </div>
        </div>

      </div>

      {/* Promoters Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {['Todos', 'Promoters', 'Divulgadores', 'Ativos', 'Pausados'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTableFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  tableFilter === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar promoter ou telefone..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Promoter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right">Vendas</th>
                <th className="py-3 px-4 text-right">Ingressos</th>
                <th className="py-3 px-4 text-right">Receita (R$)</th>
                <th className="py-3 px-4">Meta</th>
                <th className="py-3 px-4 text-right">Comissão</th>
                <th className="py-3 px-4 text-center">Conversão</th>
                <th className="py-3 px-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromoters.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${p.bg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                        {p.initials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{p.name}</span>
                        <span className="text-[11px] text-slate-400">{p.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{p.type}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">{p.sales}</td>
                  <td className="py-3.5 px-4 text-right text-slate-700">{p.tickets}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    R$ {p.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 min-w-[120px]">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>{p.target}</span>
                      <span className="font-bold text-slate-800">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-blue-600">
                    R$ {p.commission.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{p.conv}</td>
                  <td className="py-3.5 px-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedPromoter(p)}
                        className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                        title="Ver Desempenho e Metas"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(p)}
                        className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors"
                        title="Copiar Link Rastreável"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(p)}
                        className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors"
                        title="Enviar no WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Adicionar Promoter */}
      {isAddPromoterOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Cadastrar Novo Membro da Equipe</h3>
              </div>
              <button
                onClick={() => setIsAddPromoterOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromoter} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  name="promoterName"
                  placeholder="Ex: Carlos Albuquerque"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  required
                  name="promoterPhone"
                  placeholder="(41) 99000-0000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria</label>
                  <select
                    name="promoterType"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Promoter">Promoter</option>
                    <option value="Divulgador">Divulgador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meta Mensal (Ingressos)</label>
                  <input
                    type="number"
                    name="promoterTarget"
                    defaultValue={200}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 border border-blue-100 text-[11px] leading-relaxed">
                Ao cadastrar, um link rastreável exclusivo será gerado automaticamente para atribuição direta de vendas e comissão.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPromoterOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Salvar e Gerar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Promoter */}
      {selectedPromoter && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${selectedPromoter.bg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                  {selectedPromoter.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedPromoter.name}</h3>
                  <span className="text-[10px] text-slate-500">{selectedPromoter.type} • {selectedPromoter.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPromoter(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Ingressos</span>
                  <span className="font-black text-slate-800 text-base">{selectedPromoter.tickets}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Receita</span>
                  <span className="font-black text-slate-900 text-base">R$ {(selectedPromoter.revenue / 1000).toFixed(1)}k</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Comissão</span>
                  <span className="font-black text-emerald-600 text-base">R$ {selectedPromoter.commission.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Progresso da Meta Mensal:</span>
                  <span className="font-bold text-slate-800">{selectedPromoter.tickets} de {selectedPromoter.target} ingressos ({selectedPromoter.progress}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${selectedPromoter.progress}%` }} />
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Link de Divulgação:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={`https://${selectedPromoter.link}`}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => handleCopyLink(selectedPromoter)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleWhatsApp(selectedPromoter)}
                className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Conversar no WhatsApp</span>
              </button>
              <button
                onClick={() => setSelectedPromoter(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-white font-semibold rounded-lg text-xs hover:bg-slate-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
