import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Save
} from 'lucide-react';

export const AgencyDetailModal = ({ agency, isOpen, onClose, onUpdateQuota, onOpenPortal }) => {
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [newQuota, setNewQuota] = useState(agency?.quotaLimit || 0);

  React.useEffect(() => {
    if (agency?.quotaLimit !== undefined) {
      setNewQuota(agency.quotaLimit);
    }
  }, [agency]);

  if (!isOpen || !agency) return null;

  const quotaPercent = Math.min(100, Math.round((agency.quotaUsed / agency.quotaLimit) * 100)) || 0;

  const handleSaveQuota = () => {
    onUpdateQuota(agency.id, Number(newQuota));
    setIsEditingQuota(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${agency.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
              {agency.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{agency.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  agency.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {agency.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{agency.legalName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Quota Progress Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700">Consumo da Cota Mensal</span>
              
              {!isEditingQuota ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {agency.quotaUsed} / {agency.quotaLimit} ingressos ({quotaPercent}%)
                  </span>
                  <button
                    onClick={() => setIsEditingQuota(true)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Editar Cota"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    className="w-24 px-2 py-0.5 border border-blue-400 rounded text-xs text-right font-bold"
                  />
                  <button
                    onClick={handleSaveQuota}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  quotaPercent > 90 ? 'bg-rose-500' : quotaPercent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
              <span>Disponível para emissão: <strong>{agency.quotaLimit - agency.quotaUsed} ingressos</strong></span>
              <span>Renovação: 01 de Outubro</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block">Total Reservas</span>
              <span className="text-base font-extrabold text-slate-800">{agency.reservationsCount}</span>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block">Ingressos Vendidos</span>
              <span className="text-base font-extrabold text-blue-600">{agency.ticketsCount}</span>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block">Receita Acumulada</span>
              <span className="text-base font-extrabold text-emerald-600">
                R$ {agency.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Contact and Legal Details */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Informações de Contato
              </span>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{agency.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{agency.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{agency.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Condições Contratuais
              </span>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Credenciada em: {agency.contractDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{agency.paymentTerms}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Taxa DiskIngressos: 6,0%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onOpenPortal && onOpenPortal(agency)}
            className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Acessar como esta Agência no Portal B2B</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
