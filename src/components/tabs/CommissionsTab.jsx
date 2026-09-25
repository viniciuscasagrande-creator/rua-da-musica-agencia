import React, { useState } from 'react';
import {
  Percent,
  DollarSign,
  Plus,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronDown,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { COMMISSION_RULES_DATA } from '../../data/mockData';

export const CommissionsTab = () => {
  const [rules, setRules] = useState(COMMISSION_RULES_DATA);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRuleData, setNewRuleData] = useState({
    agencyName: '',
    model: 'Percentual Direto',
    ratePercent: 6.0,
    fixedValue: 3.50,
    description: ''
  });

  const totalAccrued = rules.reduce((acc, r) => acc + r.accruedAmount, 0);
  const totalPaid = rules.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalPending = rules.reduce((acc, r) => acc + r.pendingAmount, 0);

  const handleCreateRule = (e) => {
    e.preventDefault();
    const newRule = {
      id: `RULE-B2B-0${rules.length + 1}`,
      agencyId: `ag-0${rules.length + 1}`,
      agencyName: newRuleData.agencyName || 'Nova Agência Parceira',
      model: newRuleData.model,
      description: newRuleData.description || `${newRuleData.ratePercent}% sobre vendas`,
      rateBps: Math.round(newRuleData.ratePercent * 100),
      currentTier: `${newRuleData.ratePercent}% Direto`,
      accruedAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      status: 'Ativa'
    };

    setRules([newRule, ...rules]);
    setShowNewRuleModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total de Comissões Geradas</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            R$ {totalAccrued.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Acumulado de incentivo comercial B2B
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Comissões Liquidadas (Pagas)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Conciliadas no Ledger do PDT
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Pendente de Liquidação</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Aguardando fechamento da quinzena
          </p>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Modelos & Regras de Comissionamento de Agências</h3>
            <p className="text-xs text-slate-500">Configuração de remuneração conforme especificado no Escopo (Item 6 & PDF)</p>
          </div>
          <button
            onClick={() => setShowNewRuleModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Regra</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Agência Parceira</th>
                <th className="py-3 px-4">Modelo de Cálculo</th>
                <th className="py-3 px-4">Regra / Faixa</th>
                <th className="py-3 px-4 text-right">Comissão Gerada</th>
                <th className="py-3 px-4 text-right">Pago</th>
                <th className="py-3 px-4 text-right">Saldo Pendente</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{rule.agencyName}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {rule.model}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{rule.description}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    R$ {rule.accruedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-semibold">
                    R$ {rule.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-amber-600 font-bold">
                    R$ {rule.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Models Reference Guide */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
        <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Modelos Suportados no PDT (Item 6 da Espec)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Percentual Direto</span>
            <span className="text-slate-500 text-[11px]">Ex: 5% a 10% sobre o total de vendas confirmadas</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Valor Fixo por Ingresso</span>
            <span className="text-slate-500 text-[11px]">Ex: R$ 4,00 pago por ingresso emitido</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Por Tipo de Ingresso</span>
            <span className="text-slate-500 text-[11px]">Ex: Inteira R$ 3, Tour R$ 7, Corporativo R$ 10</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Faixas Progressivas</span>
            <span className="text-slate-500 text-[11px]">Ex: 0-50 (3%), 51-100 (5%), 101-200 (7%), 201+ (10%)</span>
          </div>
        </div>
      </div>

      {/* Modal Nova Regra */}
      {showNewRuleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Criar Regra de Comissão B2B</h3>
              <button onClick={() => setShowNewRuleModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agência Parceira</label>
                <input
                  type="text"
                  required
                  placeholder="Nome da Agência"
                  value={newRuleData.agencyName}
                  onChange={(e) => setNewRuleData({ ...newRuleData, agencyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modelo de Comissão</label>
                <select
                  value={newRuleData.model}
                  onChange={(e) => setNewRuleData({ ...newRuleData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Percentual Direto">Percentual Direto</option>
                  <option value="Valor Fixo por Ingresso">Valor Fixo por Ingresso</option>
                  <option value="Progressiva por Faixas">Progressiva por Faixas</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taxa de Comissão (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newRuleData.ratePercent}
                  onChange={(e) => setNewRuleData({ ...newRuleData, ratePercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRuleModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
