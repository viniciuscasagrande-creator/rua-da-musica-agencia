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
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
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
          onClick={() => setIsNewPackageOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
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
                onClick={() => setEditingPackage(prod)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Editar tarifas e regras de distribuição"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Parametrizar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Novo Pacote Turístico B2B */}
      {isNewPackageOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Criar Novo Pacote Turístico B2B</h3>
              </div>
              <button
                onClick={() => setIsNewPackageOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.pkgName.value;
                const category = form.pkgCategory.value;
                const publicPrice = parseFloat(form.pkgPublic.value) || 0;
                const b2bPrice = parseFloat(form.pkgB2B.value) || 0;
                const marginB2B = parseFloat(form.pkgMargin.value) || 15;
                const authorizedAgencies = form.pkgAgencies.value || 'Todas as agências homologadas';
                const validity = form.pkgValidity.value || 'Dezembro 2026';

                const newPkg = {
                  id: `pkg-${Date.now()}`,
                  name,
                  category,
                  publicPrice,
                  b2bPrice,
                  marginB2B,
                  authorizedAgencies,
                  validity
                };

                setProducts(prev => [newPkg, ...prev]);
                setIsNewPackageOpen(false);
                notify(`Pacote "${name}" criado com sucesso! Liberado para a rede B2B.`);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título do Pacote / Combo *</label>
                <input
                  type="text"
                  required
                  name="pkgName"
                  placeholder="Ex: Combo Parque + Bosque do Papa + Tour Guiado"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria</label>
                  <select
                    name="pkgCategory"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="EXPERIÊNCIA">Experiência</option>
                    <option value="COMBO TURÍSTICO">Combo Turístico</option>
                    <option value="GRUPO EXCURSÃO">Grupo Excursão</option>
                    <option value="CULTURAL">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vigência</label>
                  <input
                    type="text"
                    name="pkgValidity"
                    defaultValue="Válido até 31/12/2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço Público (R$)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    name="pkgPublic"
                    defaultValue={60.00}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço B2B (R$)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    name="pkgB2B"
                    defaultValue={45.00}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-blue-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Margem Agência (%)</label>
                  <input
                    type="number"
                    required
                    name="pkgMargin"
                    defaultValue={25}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Canais / Agências Autorizadas</label>
                <input
                  type="text"
                  name="pkgAgencies"
                  defaultValue="Todas as agências homologadas"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPackageOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Publicar Pacote B2B
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Parametrizar Regras do Pacote */}
      {editingPackage && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Parametrizar Regras: {editingPackage.name}</h3>
              </div>
              <button
                onClick={() => setEditingPackage(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newB2b = parseFloat(form.editB2B.value) || editingPackage.b2bPrice;
                const newMargin = parseFloat(form.editMargin.value) || editingPackage.marginB2B;

                setProducts(prev => prev.map(p =>
                  p.id === editingPackage.id
                    ? { ...p, b2bPrice: newB2b, marginB2B: newMargin }
                    : p
                ));
                setEditingPackage(null);
                notify(`Parâmetros de "${editingPackage.name}" atualizados com sucesso!`);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <span className="text-slate-500 block">Produto</span>
                <span className="font-bold text-slate-800 text-sm">{editingPackage.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço B2B (R$)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    name="editB2B"
                    defaultValue={editingPackage.b2bPrice}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-blue-700 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Margem Agência (%)</label>
                  <input
                    type="number"
                    required
                    name="editMargin"
                    defaultValue={editingPackage.marginB2B}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-emerald-700 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                A atualização afeta imediatamente cotações de novas reservas emitidas pelas agências credenciadas.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5">
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
