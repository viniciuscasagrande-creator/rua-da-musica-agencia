import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  MapPin,
  Users,
  Ticket,
  ChevronDown,
  CheckCircle2,
  QrCode,
  DollarSign,
  Megaphone,
  Printer,
  FileText,
  Building2,
  Search,
  Eye,
  Send,
  Phone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import {
  REPORTS_EXECUTIVE_DATA,
  AGENCY_SALES_VS_ACCESS_DATA,
  GEOGRAPHIC_NATIONAL_DATA,
  AGENCIES_ZERO_SALES_DATA,
  MARKETING_CAMPAIGNS_DATA,
  COMMERCIAL_CONTRACTS
} from '../../data/mockData';

export const ReportsTab = () => {
  const [activeReportSubTab, setActiveReportSubTab] = useState('visao-geral');
  const [selectedAgencyAccessLogs, setSelectedAgencyAccessLogs] = useState(AGENCY_SALES_VS_ACCESS_DATA[0]);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Custom Report Builder States
  const [filterState, setFilterState] = useState('ALL');
  const [filterProduct, setFilterProduct] = useState('ALL');
  const [filterGroupBy, setFilterGroupBy] = useState('agencia');

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const exportReport = (format) => {
    notify(`Relatório exportado em ${format.toUpperCase()} com sucesso! O download começará em instantes.`);
  };

  const handleOpenAgencyAccessModal = (agency) => {
    setSelectedAgencyAccessLogs(agency);
    setIsAccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Inteligência & Auditoria B2B • Ciclo Completo</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Central de Relatórios da Rede de Agências
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Rastreabilidade ponta a ponta: <strong>Agência → Divulgação → Reserva → Venda → Ingresso → QR Code → Acesso → Financeiro</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Horizontal Reports Sub-Menu */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto pb-px text-xs font-bold">
        {[
          { id: 'visao-geral', label: 'Dashboard de Relatórios' },
          { id: 'venda-acesso', label: 'Venda × Acesso (Catracas)' },
          { id: 'geografico', label: 'Distribuição Geográfica' },
          { id: 'sem-producao', label: 'Agências Sem Produção' },
          { id: 'marketing', label: 'Marketing & Campanhas' },
          { id: 'financeiro', label: 'Financeiro & Contratos' },
          { id: 'personalizado', label: 'Criar Relatório Personalizado' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportSubTab(tab.id)}
            className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-all ${
              activeReportSubTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. VISÃO GERAL / DASHBOARD EXECUTIVO DE RELATÓRIOS */}
      {activeReportSubTab === 'visao-geral' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-400">
                  DESEMPENHO CONSOLIDADO NACIONAL
                </span>
                <h3 className="text-xl font-black text-white">RELATÓRIOS — REDE DE AGÊNCIAS</h3>
              </div>
              <span className="text-xs text-slate-400">Dados consolidados do Core DiskIngressos</span>
            </div>

            {/* Top 6 Executive Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {REPORTS_EXECUTIVE_DATA.totalAgencies}
                </span>
                <span className="text-[11px] text-slate-400">Agências Cadastradas</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-blue-400 block">
                  {REPORTS_EXECUTIVE_DATA.activeWithSales}
                </span>
                <span className="text-[11px] text-slate-400">Agências com Vendas</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-slate-100 block">
                  {REPORTS_EXECUTIVE_DATA.ticketsSold.toLocaleString('pt-BR')}
                </span>
                <span className="text-[11px] text-slate-400">Ingressos Vendidos</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                  R$ {(REPORTS_EXECUTIVE_DATA.grossSalesAmount / 1000).toFixed(0)} mil
                </span>
                <span className="text-[11px] text-slate-400">Volume Total de Vendas</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-purple-400 block">
                  {REPORTS_EXECUTIVE_DATA.actualParkAccesses.toLocaleString('pt-BR')}
                </span>
                <span className="text-[11px] text-slate-400">Acessos Reais Catraca</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                  {REPORTS_EXECUTIVE_DATA.utilizationRate}%
                </span>
                <span className="text-[11px] text-slate-400">Taxa de Utilização</span>
              </div>
            </div>

            {/* Quick Filter Tiles */}
            <div className="pt-2 border-t border-slate-700/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Atalhos de Relatórios Analíticos:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveReportSubTab('geografico')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Vendas por Estado]
                </button>
                <button
                  onClick={() => setActiveReportSubTab('venda-acesso')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Vendas por Agência]
                </button>
                <button
                  onClick={() => setActiveReportSubTab('venda-acesso')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Ingressos vendidos × utilizados]
                </button>
                <button
                  onClick={() => setActiveReportSubTab('financeiro')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Receita por período]
                </button>
                <button
                  onClick={() => setActiveReportSubTab('marketing')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Desempenho das campanhas]
                </button>
                <button
                  onClick={() => setActiveReportSubTab('sem-producao')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  [Expansão da rede nacional]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VENDA × ACESSO (O MAIS IMPORTANTE) */}
      {activeReportSubTab === 'venda-acesso' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Relatório Venda × Acesso por Agência</h3>
              <p className="text-xs text-slate-500">
                Cruza o volume de ingressos vendidos com os acessos reais validados nas catracas do Parque Jaime Lerner.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Clique no total de acessos para abrir o drill-down individual</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Agência / Localização</th>
                    <th className="py-3 px-4 text-center">Pedidos</th>
                    <th className="py-3 px-4 text-center">Ingressos Vendidos</th>
                    <th className="py-3 px-4 text-right">Valor Vendido</th>
                    <th className="py-3 px-4 text-center">Ingressos Utilizados</th>
                    <th className="py-3 px-4 text-center">Não Utilizados</th>
                    <th className="py-3 px-4 text-center">Taxa Utilização</th>
                    <th className="py-3 px-4 text-center">Cancelados</th>
                    <th className="py-3 px-4 text-right">Comissão Agência</th>
                    <th className="py-3 px-4 text-right">Drill-Down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {AGENCY_SALES_VS_ACCESS_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.city} - {item.state}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {item.ordersCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {item.ticketsSold.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenAgencyAccessModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black border border-emerald-200 transition-colors"
                          title="Clique para auditar cada acesso individual"
                        >
                          {item.ticketsUsed.toLocaleString('pt-BR')} acessos ↗
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center text-amber-600 font-bold">
                        {item.ticketsUnused}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {item.utilizationRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400">
                        {item.cancelledTickets}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                        R$ {item.commissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAgencyAccessModal(item)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISTRIBUIÇÃO GEOGRÁFICA NACIONAL */}
      {activeReportSubTab === 'geografico' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900">Distribuição Nacional de Agências e Vendas</h3>
            <p className="text-xs text-slate-500">
              Hierarquia territorial completa: <strong>Brasil → Estado → Cidade → Agência → Venda → Pedido → Ingresso → Acesso</strong>.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-5">Estado</th>
                  <th className="py-3 px-4 text-center">Agências Cadastradas</th>
                  <th className="py-3 px-4 text-center font-bold text-blue-700">Agências Vendendo</th>
                  <th className="py-3 px-4 text-center">Ingressos Vendidos</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900">Receita Total</th>
                  <th className="py-3 px-4 text-center">Participação %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {GEOGRAPHIC_NATIONAL_DATA.map((row) => (
                  <tr key={row.stateUf} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {row.stateUf} - {row.stateName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {row.agenciesCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-blue-700">
                      {row.activeSelling} ({Math.round((row.activeSelling / row.agenciesCount) * 100)}%)
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {row.ticketsSold.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                      {row.sharePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AGÊNCIAS SEM PRODUÇÃO */}
      {activeReportSubTab === 'sem-producao' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <h3 className="text-base font-bold text-slate-900">Agências Sem Produção (Ação Comercial Imediata)</h3>
            <p className="text-xs text-slate-500">
              Identifica agências credenciadas com queda de demanda ou que nunca efetuaram uma venda, permitindo envio de campanhas de ativação comercial.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Agência & Contato</th>
                  <th className="py-3 px-4">Cidade / UF</th>
                  <th className="py-3 px-4">Data Cadastro</th>
                  <th className="py-3 px-4">Última Venda</th>
                  <th className="py-3 px-4 text-center">Dias Inativa</th>
                  <th className="py-3 px-4 text-right">Ações Comerciais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {AGENCIES_ZERO_SALES_DATA.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{ag.name}</span>
                      <span className="text-[11px] text-slate-400">{ag.contactName} • {ag.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{ag.city} - {ag.state}</td>
                    <td className="py-3.5 px-4 text-slate-500">{ag.registeredAt}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-rose-600">{ag.lastSale}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">
                      {ag.daysInactive} dias
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => notify(`Enviando campanha promocional para ${ag.name}...`)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold border border-blue-200 text-xs"
                        >
                          Enviar Campanha
                        </button>
                        <button
                          onClick={() => notify(`Ligação comercial iniciada para ${ag.contactName} (${ag.phone})`)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold border border-emerald-200 text-xs"
                        >
                          Contato
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

      {/* 5. MARKETING & CAMPANHAS */}
      {activeReportSubTab === 'marketing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <h3 className="text-base font-bold text-slate-900">Desempenho de Campanhas de Marketing B2B</h3>
            <p className="text-xs text-slate-500">
              Mapeamento completo: <strong>Campanha → Agência → Link/QR → Pedido → Ingresso → Acesso</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MARKETING_CAMPAIGNS_DATA.map((camp) => (
              <div key={camp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    {camp.id}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    {camp.status}
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900">{camp.title}</h4>
                <p className="text-xs text-slate-500">Vigência: {camp.period}</p>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Agências</span>
                    <span className="font-bold text-slate-800">{camp.participatingAgencies}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cliques</span>
                    <span className="font-bold text-blue-600">{camp.clicksCount.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pedidos</span>
                    <span className="font-bold text-emerald-600">{camp.ordersCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ingressos</span>
                    <span className="font-bold text-slate-800">{camp.ticketsSold}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Utilizados</span>
                    <span className="font-bold text-purple-700">{camp.ticketsUsed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Receita</span>
                    <span className="font-bold text-slate-900">R$ {(camp.revenue / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FINANCEIRO & CONTRATOS */}
      {activeReportSubTab === 'financeiro' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <h3 className="text-base font-bold text-slate-900">Relatório Financeiro por Condição Comercial</h3>
            <p className="text-xs text-slate-500">
              Apresenta a taxa administrativa e a comissão aplicadas exatamente conforme o contrato vigente de cada agência parceira.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Agência & Contrato</th>
                  <th className="py-3 px-4 text-right">Vendas Brutas</th>
                  <th className="py-3 px-4 text-right">Taxa Disk (Contratual)</th>
                  <th className="py-3 px-4 text-right">Comissões Retidas</th>
                  <th className="py-3 px-4 text-right">Cancelamentos</th>
                  <th className="py-3 px-4 text-right font-bold text-emerald-700">Valor Conciliado Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {COMMERCIAL_CONTRACTS.map((ctr) => (
                  <tr key={ctr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {ctr.agencyName}
                      <span className="text-[10px] text-slate-400 font-mono block">{ctr.id} (v{ctr.version})</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      R$ {ctr.creditUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-700">
                      R$ {((ctr.creditUsed * ctr.diskFeePercent) / 100).toFixed(2)} ({ctr.diskFeePercent}%)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700">
                      R$ {((ctr.creditUsed * ctr.agencyCommissionPercent) / 100).toFixed(2)} ({ctr.agencyCommissionPercent}%)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      R$ 0,00
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      R$ {(ctr.creditUsed - (ctr.creditUsed * ctr.agencyCommissionPercent) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. RELATÓRIO PERSONALIZADO (CONSTRUTOR) */}
      {activeReportSubTab === 'personalizado' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Construtor de Relatórios Personalizados</h3>
            <p className="text-xs text-slate-500">Selecione filtros específicos para gerar relatórios detalhados sob demanda com exportação para Excel, CSV e PDF.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Período:</label>
              <input type="date" defaultValue="2026-09-01" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Estado:</label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
              >
                <option value="ALL">Todos os Estados</option>
                <option value="PR">Paraná (PR)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="MG">Minas Gerais (MG)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Agrupar Por:</label>
              <select
                value={filterGroupBy}
                onChange={(e) => setFilterGroupBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
              >
                <option value="agencia">Agência de Turismo</option>
                <option value="estado">Estado / Cidade</option>
                <option value="produto">Produto / Pacote</option>
                <option value="campanha">Campanha de Marketing</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs text-slate-700">
              <span className="font-bold">Status do Ingresso:</span>
              <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Vendido</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Utilizado</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" /> Não Utilizado</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" /> Cancelado</label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReport('csv')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Exportar CSV
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Gerar Relatório Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRILL-DOWN MODAL: DETALHE DE CADA ACESSO INDIVIDUAL */}
      {isAccessModalOpen && selectedAgencyAccessLogs && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Acessos Validados nas Catracas • {selectedAgencyAccessLogs.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {selectedAgencyAccessLogs.ticketsUsed} ingressos utilizados (Taxa de Utilização: {selectedAgencyAccessLogs.utilizationRate}%)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAccessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Vendido</span>
                  <span className="font-extrabold text-slate-900">{selectedAgencyAccessLogs.ticketsSold} ingressos</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Acessaram o Parque</span>
                  <span className="font-extrabold text-emerald-700">{selectedAgencyAccessLogs.ticketsUsed} acessos</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Não Utilizados</span>
                  <span className="font-extrabold text-amber-600">{selectedAgencyAccessLogs.ticketsUnused} ingressos</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Data / Hora</th>
                      <th className="py-2.5 px-3">Ingresso</th>
                      <th className="py-2.5 px-3">Pedido</th>
                      <th className="py-2.5 px-3">QR Code</th>
                      <th className="py-2.5 px-3">Produto</th>
                      <th className="py-2.5 px-3">Portão / Catraca</th>
                      <th className="py-2.5 px-3 text-center">Acesso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedAgencyAccessLogs.accessLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono">{log.time}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{log.ticketId}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{log.orderId}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{log.qrCode}</td>
                        <td className="py-2.5 px-3 text-slate-800">{log.product}</td>
                        <td className="py-2.5 px-3 text-slate-500">{log.gate}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Autorizado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsAccessModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
