import React, { useState, useEffect } from 'react';
import { Tag, Percent, Calculator, Check, Edit2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { TICKET_CATALOG } from '../../data/mockData';

export const PricingTab = () => {
  const [feePercent, setFeePercent] = useState(6.0);
  const [catalog, setCatalog] = useState(TICKET_CATALOG);
  const [simBasePrice, setSimBasePrice] = useState(50.00);

  useEffect(() => {
    fetch('/api/b2b/pricing')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setCatalog(res.data);
          if (res.currentFeePercent !== undefined) {
            setFeePercent(res.currentFeePercent);
          }
        }
      })
      .catch(err => console.warn('[PDT] Could not fetch pricing catalog:', err));
  }, []);

  const calculateFinal = (base, fee) => {
    const feeVal = (base * fee) / 100;
    return {
      feeVal,
      final: base + feeVal
    };
  };

  const handlePriceChange = async (id, newBase) => {
    const base = parseFloat(newBase) || 0;
    setCatalog(prev =>
      prev.map(item => {
        if (item.id === id) {
          const fee = (base * feePercent) / 100;
          return {
            ...item,
            basePrice: base,
            feeAmount: fee,
            finalPrice: base + fee
          };
        }
        return item;
      })
    );

    try {
      await fetch(`/api/b2b/pricing/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice: base })
      });
    } catch (err) {
      console.warn('[PDT] Could not sync price with API:', err);
    }
  };

  const handleFeeChange = async (newFee) => {
    setFeePercent(newFee);
    try {
      await fetch('/api/b2b/pricing/global-fee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feePercent: newFee })
      });
    } catch (err) {
      console.warn('[PDT] Could not sync fee with API:', err);
    }
  };

  const simCalc = calculateFinal(simBasePrice, feePercent);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Explanation */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-lg">Tarifário B2B & Parametrização de Taxa</h3>
          </div>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            Catálogo de produtos comercializáveis para agências de turismo credenciadas. A taxa administrativa DiskIngressos é parametrizada no sistema e embutida no valor final cobrado da agência parceira.
          </p>
        </div>

        {/* Global Fee Slider */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px]">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-blue-100">Taxa Administrativa PDT:</span>
            <span className="font-extrabold text-white text-base">{feePercent.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={feePercent}
            onChange={(e) => handleFeeChange(parseFloat(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-blue-200 mt-1">
            <span>0% (Isento)</span>
            <span className="font-bold text-orange-300">Padrão: 6%</span>
            <span>15%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Catalog Table & Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Catalog Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Catálogo de Ingressos Ativos</h4>
              <p className="text-xs text-slate-500">Valores comercializados pelo Parque Jaime Lerner no canal B2B</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Tipo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-5">Produto</th>
                  <th className="py-3 px-4">Preço Base (Operador)</th>
                  <th className="py-3 px-4">Taxa Disk ({feePercent}%)</th>
                  <th className="py-3 px-4 text-right">Preço Final B2B</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalog.map((item) => {
                  const fee = (item.basePrice * feePercent) / 100;
                  const finalVal = item.basePrice + fee;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <span>R$</span>
                          <input
                            type="number"
                            step="0.50"
                            value={item.basePrice}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-200 rounded font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-500">
                        + R$ {fee.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          R$ {finalVal.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200">
                          Liberado
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Simulator */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-800 text-sm">Simulador de Pacote / Cotação</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Calcule instantaneamente o repasse líquido para o operador e a taxa administrativa com base em novos produtos ou combos.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preço Base Sugerido (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">R$</span>
                  <input
                    type="number"
                    value={simBasePrice}
                    onChange={(e) => setSimBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2.5 border border-slate-200">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Preço Base do Parque:</span>
                  <span className="font-semibold text-slate-800">R$ {simBasePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Taxa DiskIngressos ({feePercent}%):</span>
                  <span className="font-semibold text-orange-600">+ R$ {simCalc.feeVal.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-blue-900 font-bold">
                  <span>Preço Final para a Agência:</span>
                  <span className="text-base text-blue-700">R$ {simCalc.final.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 mt-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
            <span className="font-bold block mb-0.5">Repasse Garantido</span>
            O valor de R$ {simBasePrice.toFixed(2)} é repassado integralmente ao operador na conciliação semanal do PDT.
          </div>
        </div>

      </div>

    </div>
  );
};
