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
  CheckCircle2
} from 'lucide-react';
import { STATES_DISTRIBUTION, AGENCIES_LIST, TICKET_CATALOG } from '../../data/mockData';

export const ReportsTab = () => {
  const [period, setPeriod] = useState('Setembro 2026');
  const [reportType, setReportType] = useState('origem');

  const exportReport = (format) => {
    alert(`Exportação do relatório em formato ${format.toUpperCase()} gerada com sucesso! O download começará em instantes.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Export Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Relatórios & Inteligência Turística B2B</h3>
          </div>
          <p className="text-xs text-slate-500">
            Métricas analíticas consolidadas de vendas, origem geográfica de turistas e desempenho por produto
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none"
            >
              <option value="Setembro 2026">Setembro 2026</option>
              <option value="Agosto 2026">Agosto 2026</option>
              <option value="3º Trimestre 2026">3º Trimestre 2026</option>
              <option value="Ano 2026">Ano Completo 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => exportReport('csv')}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Grid: Origin by State & Performance by Product */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Origin by State Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-900">Origem Geográfica dos Turistas (por UF)</h4>
            </div>
            <span className="text-xs text-slate-400">Total: 6.842 pax</span>
          </div>

          <div className="space-y-3">
            {STATES_DISTRIBUTION.map((st) => (
              <div key={st.uf} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">{st.name} ({st.uf})</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium">{st.tickets.toLocaleString('pt-BR')} visitantes</span>
                    <span className="font-bold text-slate-900 w-10 text-right">{st.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${st.percentage}%`, backgroundColor: st.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Product Type */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-orange-600" />
              <h4 className="font-bold text-sm text-slate-900">Vendas por Tipo de Ingresso B2B</h4>
            </div>
            <span className="text-xs text-slate-400">5 Categorias</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Produto</th>
                  <th className="py-2.5 px-2 text-right">Preço B2B</th>
                  <th className="py-2.5 px-2 text-right">Qtd. Distribuída</th>
                  <th className="py-2.5 px-3 text-right">Receita Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TICKET_CATALOG.map((p, idx) => {
                  const estQtd = [3420, 1850, 820, 510, 242][idx];
                  const estRev = estQtd * p.finalPrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{p.name}</td>
                      <td className="py-2.5 px-2 text-right text-slate-600">R$ {p.finalPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-600">{estQtd.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        R$ {estRev.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Top Agencies Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900">Ranking de Receita por Agência Parceira</h4>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">Ver todas as 42 agências</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Posição & Agência</th>
                <th className="py-3 px-4">Localidade</th>
                <th className="py-3 px-4 text-right">Reservas Concluídas</th>
                <th className="py-3 px-4 text-right">Ingressos Emitidos</th>
                <th className="py-3 px-4 text-right">Taxa Disk (6%)</th>
                <th className="py-3 px-5 text-right">Receita Gerada (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AGENCIES_LIST.map((ag, i) => (
                <tr key={ag.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-5 font-bold text-slate-800 flex items-center gap-2.5">
                    <span className="w-5 text-slate-400 font-black">{i + 1}º</span>
                    <span>{ag.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{ag.location}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">{ag.reservationsCount}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-blue-600">{ag.ticketsCount}</td>
                  <td className="py-3.5 px-4 text-right text-orange-600 font-medium">
                    R$ {ag.diskFeeAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-black text-slate-900">
                    R$ {ag.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
