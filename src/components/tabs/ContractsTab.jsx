import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Percent,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Edit2,
  Plus,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { COMMERCIAL_CONTRACTS } from '../../data/mockData';

export const ContractsTab = () => {
  const [contracts, setContracts] = useState(COMMERCIAL_CONTRACTS);
  const [search, setSearch] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleBlock = (contractId) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const newStatus = c.status === 'Bloqueado' ? 'Vigente' : 'Bloqueado';
          notify(`Status do contrato ${c.id} alterado para: ${newStatus}`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const filteredContracts = contracts.filter(c =>
    c.agencyName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Motor Comercial B2B • Parque Jaime Lerner</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Contratos Comerciais & Limites de Crédito
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cada agência possui um contrato comercial versionado, definindo taxa de serviço B2B, comissão da agência, prazo de pagamento (faturado 15/30 dias ou pré-pago) e limite de crédito com bloqueio automático.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Volume Total de Crédito</span>
            <span className="text-sm font-black text-slate-900">R$ 170.000,00</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por agência ou código de contrato..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{filteredContracts.length} contratos homologados</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Contrato & Agência</th>
                <th className="py-3 px-4">Taxa B2B</th>
                <th className="py-3 px-4">Comissão Agência</th>
                <th className="py-3 px-4">Condição de Pagamento</th>
                <th className="py-3 px-4">Limite de Crédito</th>
                <th className="py-3 px-4">Saldo Disponível</th>
                <th className="py-3 px-4">Vigência</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredContracts.map((c) => {
                const creditPct = Math.round((c.creditUsed / c.creditLimit) * 100) || 0;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Contract & Agency */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                          v{c.version}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{c.agencyName}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Taxa B2B */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {c.diskFeePercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Agency Commission */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.agencyCommissionPercent.toFixed(1)}%
                      </span>
                      {c.specialRule && (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.specialRule}</p>
                      )}
                    </td>

                    {/* Payment Terms */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold">{c.paymentTerms}</span>
                      <p className="text-[10px] text-slate-400">Cancelamento: {c.cancellationWindowHours}h</p>
                    </td>

                    {/* Credit Limit */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 font-mono">
                        R$ {c.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${creditPct > 80 ? 'bg-rose-500' : 'bg-blue-600'}`}
                          style={{ width: `${creditPct}%` }}
                        />
                      </div>
                    </td>

                    {/* Credit Available */}
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold ${c.creditAvailable < 5000 ? 'text-amber-600' : 'text-emerald-700'}`}>
                        R$ {c.creditAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <p className="text-[10px] text-slate-400">{creditPct}% em uso</p>
                    </td>

                    {/* Validity */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {c.validUntil}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Vigente'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'Em Homologação'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleBlock(c.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            c.status === 'Bloqueado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                          title={c.status === 'Bloqueado' ? 'Desbloquear Crédito' : 'Bloquear Crédito (Inadimplência)'}
                        >
                          {c.status === 'Bloqueado' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setSelectedContract(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-colors"
                        >
                          Detalhes
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

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Contrato Comercial • {selectedContract.agencyName}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedContract.id} • Versão {selectedContract.version} (Vigente)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Taxa B2B</span>
                  <span className="text-sm font-extrabold text-blue-700">{selectedContract.diskFeePercent.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Comissão da Agência</span>
                  <span className="text-sm font-extrabold text-emerald-700">{selectedContract.agencyCommissionPercent.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Prazo de Pagamento</span>
                  <span className="font-semibold text-slate-800">{selectedContract.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Janela de Cancelamento</span>
                  <span className="font-semibold text-slate-800">{selectedContract.cancellationWindowHours}h sem retenção</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Produtos Autorizados no Contrato:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContract.authorizedProducts.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <strong>Regra Especial:</strong> {selectedContract.specialRule}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    notify("Solicitação de aditivo contratual enviada ao jurídico!");
                    setSelectedContract(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Gerar Novo Aditivo (v{selectedContract.version + 1})
                </button>
              </div>
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
