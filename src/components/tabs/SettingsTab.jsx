import React, { useState, useEffect } from 'react';
import {
  Settings,
  Layers,
  Percent,
  Clock,
  ShieldCheck,
  Save,
  Check,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { OPERATOR_INFO, RBAC_OPERATOR_PERMISSIONS } from '../../data/mockData';

export const SettingsTab = () => {
  const [totalCapacity, setTotalCapacity] = useState(3000);
  const [siteQuota, setSiteQuota] = useState(1500);
  const [boxOfficeQuota, setBoxOfficeQuota] = useState(800);
  const [b2bQuota, setB2bQuota] = useState(700);

  const [feePercent, setFeePercent] = useState(6.0);
  const [autoReturnHours, setAutoReturnHours] = useState(48);
  const [permissions, setPermissions] = useState(RBAC_OPERATOR_PERMISSIONS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch initial parameters from PDT API
  useEffect(() => {
    // 1. Fetch fee
    fetch('/api/b2b/pricing')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.currentFeePercent !== undefined) {
          setFeePercent(res.currentFeePercent);
        }
      })
      .catch(err => console.warn('[PDT] Could not fetch pricing config:', err));

    // 2. Fetch inventory allocation
    fetch('/api/b2b/inventory/status')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.channels) {
          setTotalCapacity(res.data.totalCapacity || 3000);
          setSiteQuota(res.data.channels.site.quota);
          setBoxOfficeQuota(res.data.channels.bilheteria.quota);
          setB2bQuota(res.data.channels.b2b.quota);
        }
      })
      .catch(err => console.warn('[PDT] Could not fetch inventory config:', err));
  }, []);

  const currentSum = siteQuota + boxOfficeQuota + b2bQuota;
  const isBalanced = currentSum === totalCapacity;

  const togglePermission = (id) => {
    setPermissions(prev =>
      prev.map(p => (p.id === id ? { ...p, defaultActive: !p.defaultActive } : p))
    );
  };

  const handleSave = async () => {
    if (!isBalanced) {
      setSaveError(`A soma das cotas (${currentSum}) difere da capacidade total (${totalCapacity}).`);
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSavedSuccess(false);

    try {
      // 1. Save Fee
      const feeRes = await fetch('/api/b2b/pricing/global-fee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feePercent })
      });
      const feeData = await feeRes.json();
      if (!feeRes.ok || !feeData.success) {
        throw new Error(feeData.error || 'Erro ao salvar taxa administrativa.');
      }

      // 2. Save Inventory Allocation
      const invRes = await fetch('/api/b2b/inventory/allocation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteQuota,
          boxOfficeQuota,
          b2bQuota
        })
      });
      const invData = await invRes.json();
      if (!invRes.ok || !invData.success) {
        throw new Error(invData.error || 'Erro ao redistribuir cotas de inventário.');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Save settings error:', err);
      setSaveError(err.message || 'Falha ao salvar parâmetros no servidor da DiskIngressos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* 1. Inventário Centralizado & Divisão de Cotas (Item 5.4 da Espec) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Inventário Centralizado & Cotas por Canal</h3>
              <p className="text-xs text-slate-500">Distribuição da capacidade diária do Parque Jaime Lerner sem risco de overselling</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Capacidade Total Diária</span>
            <span className="text-lg font-black text-slate-900">{totalCapacity} ingressos/dia</span>
          </div>
        </div>

        {/* Visual Channel Distribution Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-blue-600">Site DiskIngressos ({Math.round((siteQuota / totalCapacity) * 100)}%)</span>
            <span className="text-emerald-600">Bilheteria Física ({Math.round((boxOfficeQuota / totalCapacity) * 100)}%)</span>
            <span className="text-purple-600">Canal Agências B2B ({Math.round((b2bQuota / totalCapacity) * 100)}%)</span>
          </div>

          <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 shadow-inner">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(siteQuota / totalCapacity) * 100}%` }} />
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(boxOfficeQuota / totalCapacity) * 100}%` }} />
            <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${(b2bQuota / totalCapacity) * 100}%` }} />
          </div>

          {!isBalanced && (
            <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>A soma das cotas ({currentSum}) difere da capacidade total ({totalCapacity}). Ajuste os valores.</span>
            </div>
          )}
        </div>

        {/* Channel Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="font-bold text-slate-800 block mb-1">Cota Site DiskIngressos</label>
            <span className="text-xl font-extrabold text-blue-600 block mb-2">{siteQuota} ingressos</span>
            <input
              type="range"
              min="0"
              max={totalCapacity}
              step="50"
              value={siteQuota}
              onChange={(e) => setSiteQuota(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="font-bold text-slate-800 block mb-1">Cota Bilheteria Local</label>
            <span className="text-xl font-extrabold text-emerald-600 block mb-2">{boxOfficeQuota} ingressos</span>
            <input
              type="range"
              min="0"
              max={totalCapacity}
              step="50"
              value={boxOfficeQuota}
              onChange={(e) => setBoxOfficeQuota(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="font-bold text-slate-800 block mb-1">Cota Agências B2B</label>
            <span className="text-xl font-extrabold text-purple-600 block mb-2">{b2bQuota} ingressos</span>
            <input
              type="range"
              min="0"
              max={totalCapacity}
              step="50"
              value={b2bQuota}
              onChange={(e) => setB2bQuota(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>
        </div>

        {/* Regra de Devolução Automática (Item 5.4 da Espec) */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <span className="font-bold text-blue-900 block">Regra de Devolução Automática de Estoque B2B</span>
            <p className="text-blue-800 leading-relaxed">
              Ingressos alocados para agências B2B que não forem reservados com antecedência retornam automaticamente para a venda geral no site e na bilheteria local.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-slate-700 font-medium">Prazo de expiração da cota B2B:</span>
              <select
                value={autoReturnHours}
                onChange={(e) => setAutoReturnHours(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 focus:outline-none"
              >
                <option value={24}>24 horas antes da visita</option>
                <option value={48}>48 horas antes da visita (Recomendado)</option>
                <option value={72}>72 horas antes da visita</option>
                <option value={120}>5 dias antes da visita</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Parametrização da Taxa DiskIngressos (Item 5.2 da Espec) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Taxa Administrativa DiskIngressos (B2B)</h3>
            <p className="text-xs text-slate-500">Configuração de margem e apuração contábil no Ledger</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">Percentual Padrão Contratado</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={feePercent}
                onChange={(e) => setFeePercent(parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 font-bold"
              />
              <span className="text-sm font-black text-slate-800">%</span>
              <span className="text-[11px] text-slate-400">({Math.round(feePercent * 100)} bps no schema Prisma)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">Forma de Aplicação no Catálogo</label>
            <div className="space-y-1 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="feeType" defaultChecked className="accent-blue-600" />
                <span>Embutida no preço exibido para a agência parceira (Recomendado)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="feeType" className="accent-blue-600" />
                <span>Acrescida separadamente no checkout final</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Controle de Permissões RBAC (Item 4 & 7 da Espec) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Perfis de Acesso & Permissões RBAC</h3>
            <p className="text-xs text-slate-500">Reutiliza o sistema nativo de permissões do PDT DiskIngressos</p>
          </div>
        </div>

        <div className="space-y-2.5 divide-y divide-slate-100">
          {permissions.map((perm) => (
            <div key={perm.id} className="pt-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{perm.name}</span>
                <span className="text-slate-500 text-[11px]">{perm.desc}</span>
              </div>
              <button
                type="button"
                onClick={() => togglePermission(perm.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  perm.defaultActive ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    perm.defaultActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button & Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {saveError && (
          <span className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </span>
        )}

        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <Check className="w-4 h-4" /> Parâmetros do Parque e Cotas atualizados no PDT!
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando no PDT...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Parâmetros Operacionais</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
