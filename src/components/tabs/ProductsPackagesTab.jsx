import React, { useState } from 'react';
import {
  Package,
  Tag,
  CheckCircle,
  Plus,
  Edit2,
  Sparkles,
  Percent,
  Search,
  Building2,
  Calendar
} from 'lucide-react';
import { PRODUCTS_AND_PACKAGES_DATA } from '../../data/mockData';

export const ProductsPackagesTab = () => {
  const [products, setProducts] = useState(PRODUCTS_AND_PACKAGES_DATA);
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Catálogo B2B • Parque Jaime Lerner</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Produtos & Pacotes Autorizados para Agências
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure quais produtos, experiências exclusivas e combos turísticos estão disponíveis para comercialização por cada canal credenciado.
          </p>
        </div>

        <button
          onClick={() => notify("Criar novo pacote ou combo turístico para a rede B2B.")}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Pacote Turístico</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {prod.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Margem Agência: {prod.marginB2B}%
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{prod.name}</h3>
              <p className="text-xs text-slate-500">
                <strong>Agências Autorizadas:</strong> {prod.authorizedAgencies}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Vigência:</strong> {prod.validity}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block line-through">
                  Público: R$ {prod.publicPrice.toFixed(2)}
                </span>
                <span className="text-lg font-black text-blue-700">
                  B2B: R$ {prod.b2bPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => notify(`Editando regras de distribuição do produto ${prod.id}...`)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Parametrizar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
