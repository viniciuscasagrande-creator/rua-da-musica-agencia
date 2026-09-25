import React, { useState } from 'react';
import { Building2, X, Check, AlertCircle, Percent, Loader2 } from 'lucide-react';

export const NewAgencyModal = ({ isOpen, onClose, onAddAgency }) => {
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    cnpj: '',
    city: '',
    state: 'PR',
    contactName: '',
    email: '',
    phone: '',
    quotaLimit: 1000,
    paymentTerms: 'Faturamento 15 dias',
    status: 'Ativa'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cnpj) {
      setError('Nome comercial da agência e CNPJ são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/b2b/agencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          legalName: formData.legalName || formData.name,
          cnpj: formData.cnpj,
          city: formData.city || 'Curitiba',
          state: formData.state,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          quotaLimit: Number(formData.quotaLimit),
          paymentTerms: formData.paymentTerms,
          feeBps: 600
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao cadastrar agência no servidor.');
      }

      onAddAgency(result.data);
      onClose();
    } catch (err) {
      console.error('Agency registration error:', err);
      setError(err.message || 'Falha na conexão com o servidor da DiskIngressos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Cadastrar Nova Agência Parceira</h3>
              <p className="text-xs text-slate-500">Credenciamento no canal B2B do Parque Jaime Lerner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nome Comercial da Agência *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Paraná Turismo & Viagens"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CNPJ *
              </label>
              <input
                type="text"
                required
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Razão Social
              </label>
              <input
                type="text"
                placeholder="Razão Social Completa"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Curitiba"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estado (UF) *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="PR">Paraná (PR)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="DF">Distrito Federal (DF)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Responsável Comercial
              </label>
              <input
                type="text"
                placeholder="Nome do contato"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp / Telefone
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                E-mail para Acesso ao Portal da Agência *
              </label>
              <input
                type="email"
                required
                placeholder="reservas@agencia.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Limite / Cota de Ingressos (Mês)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={formData.quotaLimit}
                onChange={(e) => setFormData({ ...formData, quotaLimit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Condições de Pagamento B2B
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Faturamento 15 dias">Faturamento 15 dias</option>
                <option value="Faturamento 30 dias">Faturamento 30 dias</option>
                <option value="Pré-pago / PIX Instantâneo">Pré-pago / PIX Instantâneo</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 flex items-start gap-2.5">
            <Percent className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold block">Regra Padrão DiskIngressos</span>
              Será aplicada a taxa padrão de <strong>6,0%</strong> sobre os ingressos reservados via Portal B2B, com liberação imediata de emissão de vouchers com QR Code.
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cadastrando no PDT...</span>
                </>
              ) : (
                <span>Concluir Credenciamento</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
