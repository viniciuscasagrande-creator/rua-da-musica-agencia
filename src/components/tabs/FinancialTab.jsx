import React, { useState } from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, ShieldCheck, Download, RefreshCw, AlertCircle } from 'lucide-react';

export const FinancialTab = ({ kpis }) => {
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID Ledger,Data,Tipo,Origem / Agencia,Valor Bruto,Taxa B2B (6%),Liquido Operador,Status\n"
      + transactions.map(t => `${t.id},${t.date},${t.type},${t.agency},${t.gross},${t.fee},${t.net},${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `conciliacao_b2b_parque_jaime_lerner_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Planilha de conciliação financeira (.csv) gerada e baixada com sucesso!");
  };
  const transactions = [
    { id: 'LED-8921', date: '24/09/2026', type: 'Crédito Reserva', agency: 'Agência Turismo Brasil', gross: 667.80, fee: 37.80, net: 630.00, status: 'Conciliado' },
    { id: 'LED-8920', date: '23/09/2026', type: 'Crédito Reserva', agency: 'Mundo Brasil Turismo', gross: 1155.40, fee: 65.40, net: 1090.00, status: 'Conciliado' },
    { id: 'LED-8919', date: '22/09/2026', type: 'Crédito Reserva', agency: 'Curitiba Tour', gross: 636.00, fee: 36.00, net: 600.00, status: 'Conciliado' },
    { id: 'LED-8918', date: '21/09/2026', type: 'Estorno Parcial', agency: 'Sul Turismo', gross: -127.20, fee: -7.20, net: -120.00, status: 'Revertido no Ledger' },
    { id: 'LED-8917', date: '20/09/2026', type: 'Repasse Semanal', agency: 'Liquidação Financeira', gross: 42500.00, fee: 0, net: 42500.00, status: 'Liquidado na Conta' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Faturamento Bruto B2B</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">R$ 214.320,00</span>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +30% vs. mês anterior
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Taxa de Serviço B2B (6%)</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Retenção</span>
          </div>
          <span className="text-2xl font-black text-orange-600">R$ 12.859,20</span>
          <p className="text-[11px] text-slate-400 mt-1">
            Apurada automaticamente por reserva emitida
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Repasse Líquido Parque Jaime Lerner</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700">R$ 201.460,80</span>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            100% conciliado no Ledger Financeiro
          </p>
        </div>
      </div>

      {/* Audit & Ledger Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold block mb-0.5">Arquitetura de Integridade Contábil</span>
          O canal B2B utiliza as entidades de <strong>Pedidos</strong> e <strong>Ledger</strong> financeiro unificado, sem duplicidade financeira. Em caso de cancelamentos ou estornos, os lançamentos originais são preservados com registro de reversão correspondente para garantia de auditoria legal.
        </div>
      </div>

      {/* Ledger Entries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Extrato de Movimentações B2B (Ledger Financeiro)</h4>
            <p className="text-xs text-slate-500">Conciliação em tempo real entre operadora, parceiros e parque</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Exportar Conciliação</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">ID Ledger</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Tipo de Transação</th>
                <th className="py-3 px-4">Origem / Agência</th>
                <th className="py-3 px-4 text-right">Valor Bruto</th>
                <th className="py-3 px-4 text-right">Taxa B2B (6%)</th>
                <th className="py-3 px-4 text-right">Líquido Operador</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-700">{tx.id}</td>
                  <td className="py-3.5 px-4 text-slate-600">{tx.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{tx.type}</td>
                  <td className="py-3.5 px-4 text-slate-700">{tx.agency}</td>
                  <td className={`py-3.5 px-4 text-right font-bold ${tx.gross < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    R$ {tx.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-orange-600 font-medium">
                    R$ {tx.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-extrabold ${tx.net < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    R$ {tx.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5">
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
