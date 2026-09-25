import React, { useState } from 'react';
import {
  Layers,
  Ticket,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';
import { OPERATOR_INFO, TICKET_CATALOG } from '../../data/mockData';

export const InventoryTab = () => {
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  
  const [holds, setHolds] = useState([
    {
      id: 'HOLD-781',
      title: 'Excursão Positivo Curitiba (40 pax)',
      agency: 'Mundo Brasil Turismo',
      date: '28/09/2026',
      spots: 40,
      ttl: '6h 58m restantes',
      expiresAt: 'Expira às 17:30',
      status: 'holding',
      statusLabel: 'Segurado (Holding)'
    },
    {
      id: 'HOLD-782',
      title: 'Grupo Terceira Idade Joinville',
      agency: 'Viagens CWB Excursões',
      date: '29/09/2026',
      spots: 28,
      ttl: '3h 43m restantes',
      expiresAt: 'Expira às 14:15',
      status: 'holding',
      statusLabel: 'Segurado (Holding)'
    },
    {
      id: 'HOLD-779',
      title: 'Convenção Regional de Corretores',
      agency: 'Curitiba Tour',
      date: '27/09/2026',
      spots: 50,
      ttl: 'Expirado',
      expiresAt: '24/09 às 18:00',
      status: 'expired',
      statusLabel: 'Auto-Liberado (Devolvido)'
    }
  ]);

  const [confirmingHold, setConfirmingHold] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showNewHoldModal, setShowNewHoldModal] = useState(false);
  const [newHoldData, setNewHoldData] = useState({
    agency: 'Mundo Brasil Turismo',
    title: '',
    date: '2026-09-30',
    spots: 30,
    hours: 24
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmHold = (holdId) => {
    setHolds(prev => prev.map(h => {
      if (h.id === holdId) {
        return {
          ...h,
          status: 'confirmed',
          statusLabel: 'Confirmado (Efetivado)',
          ttl: 'Efetivado',
          expiresAt: 'Pedido B2B Gerado'
        };
      }
      return h;
    }));
    setConfirmingHold(null);
    triggerToast(`Reserva ${holdId} confirmada com sucesso! Vouchers gerados e estoque abatido.`);
  };

  const handleExtendTTL = (holdId) => {
    setHolds(prev => prev.map(h => {
      if (h.id === holdId) {
        return {
          ...h,
          ttl: '24h restantes',
          expiresAt: 'Prazo estendido'
        };
      }
      return h;
    }));
    setConfirmingHold(null);
    triggerToast(`Prazo TTL da reserva ${holdId} estendido em +24 horas.`);
  };

  const handleCreateNewHold = (e) => {
    e.preventDefault();
    if (!newHoldData.title || !newHoldData.spots) return;

    const newId = `HOLD-${Math.floor(783 + Math.random() * 50)}`;
    const newEntry = {
      id: newId,
      title: newHoldData.title,
      agency: newHoldData.agency,
      date: newHoldData.date.split('-').reverse().join('/'),
      spots: Number(newHoldData.spots),
      ttl: `${newHoldData.hours}h restantes`,
      expiresAt: `Expira em ${newHoldData.hours}h`,
      status: 'holding',
      statusLabel: 'Segurado (Holding)'
    };

    setHolds([newEntry, ...holds]);
    setShowNewHoldModal(false);
    setNewHoldData({ agency: 'Mundo Brasil Turismo', title: '', date: '2026-09-30', spots: 30, hours: 24 });
    triggerToast(`Holding ${newId} criada com sucesso para ${newHoldData.agency} (${newHoldData.spots} vagas).`);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Gestão de Inventário & Capacidade Central</h3>
          </div>
          <p className="text-xs text-slate-500">
            Estoque único por dia do Parque Jaime Lerner distribuído entre Site, Bilheteria e Agências B2B
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Capacidade Padrão:</span>
          <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            3.000 ingressos / dia
          </span>
        </div>
      </div>

      {/* Daily Capacity Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-bold text-sm text-slate-800">Ocupação & Estoque por Data</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Data da Visita</th>
                <th className="py-3 px-4 text-right">Capacidade Total</th>
                <th className="py-3 px-4 text-right">Site (Online)</th>
                <th className="py-3 px-4 text-right">Bilheteria Local</th>
                <th className="py-3 px-4 text-right">Cota B2B (Agências)</th>
                <th className="py-3 px-4 text-right font-bold text-slate-800">Saldo Livre</th>
                <th className="py-3 px-5 text-center">Taxa de Ocupação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daysCapacity.map((day) => (
                <tr key={day.date} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{day.date}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700">{day.total.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 px-4 text-right text-blue-600 font-medium">{day.soldSite}</td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-medium">{day.soldBoxOffice}</td>
                  <td className="py-3.5 px-4 text-right text-purple-600 font-bold">{day.reservedB2B}</td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    <span className={day.remaining < 200 ? 'text-rose-600' : 'text-slate-800'}>
                      {day.remaining}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      parseInt(day.occupancy) > 90
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {day.occupancy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temporary Holds with TTL / Auto-Release Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <h4 className="font-bold text-sm text-slate-800">
                Reservas Temporárias de Estoque (Holding com TTL & Liberação Automática)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Segura temporariamente vagas para agências formatarem excursões. Caso a confirmação não ocorra até o prazo, as vagas retornam automaticamente ao estoque.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Garantia Anti-Overselling
            </span>
            <button
              onClick={() => setShowNewHoldModal(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Reserva Holding</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-5">Código & Excursão</th>
                <th className="py-3 px-4">Agência Solicitante</th>
                <th className="py-3 px-4">Data do Passeio</th>
                <th className="py-3 px-4 text-center">Lugares Segurados</th>
                <th className="py-3 px-4">Expiração (TTL)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {holds.map((hold) => (
                <tr key={hold.id} className={`hover:bg-slate-50/70 ${hold.status === 'expired' ? 'opacity-70' : ''}`}>
                  <td className="py-3 px-5">
                    <span className="font-bold text-slate-900 block">{hold.id}</span>
                    <span className="text-[11px] text-slate-500">{hold.title}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{hold.agency}</td>
                  <td className="py-3 px-4 text-slate-600">{hold.date}</td>
                  <td className="py-3 px-4 text-center font-bold text-purple-700">{hold.spots} vagas</td>
                  <td className="py-3 px-4 font-mono">
                    <span className={hold.status === 'holding' ? 'text-amber-600 font-bold' : hold.status === 'confirmed' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {hold.ttl}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{hold.expiresAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      hold.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : hold.status === 'holding'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {hold.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    {hold.status === 'holding' ? (
                      <button
                        onClick={() => setConfirmingHold(hold)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Confirmar
                      </button>
                    ) : hold.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Efetivado
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Confirm Hold */}
      {confirmingHold && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Efetivar Holding B2B</h4>
              </div>
              <button
                onClick={() => setConfirmingHold(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Código de Holding:</span>
                  <span className="font-bold text-slate-900">{confirmingHold.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Agência:</span>
                  <span className="font-bold text-slate-900">{confirmingHold.agency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Excursão:</span>
                  <span className="font-medium text-slate-800">{confirmingHold.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data da Visita:</span>
                  <span className="font-bold text-blue-600">{confirmingHold.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lugares Bloqueados:</span>
                  <span className="font-bold text-purple-700">{confirmingHold.spots} vagas</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Ao efetivar, o estoque temporário é convertido em <strong>reserva definitiva B2B</strong> e os vouchers nominais são disponibilizados para a agência.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleExtendTTL(confirmingHold.id)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Estender (+24h)
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmingHold(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmHold(confirmingHold.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Efetivar Venda B2B
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Pré-Reserva (Holding) */}
      {showNewHoldModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-slate-900 text-base">Criar Holding de Estoque</h4>
              </div>
              <button
                onClick={() => setShowNewHoldModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewHold} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agência Solicitante</label>
                <select
                  value={newHoldData.agency}
                  onChange={(e) => setNewHoldData({ ...newHoldData, agency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                >
                  <option value="Mundo Brasil Turismo">Mundo Brasil Turismo</option>
                  <option value="Viagens CWB Excursões">Viagens CWB Excursões</option>
                  <option value="Curitiba Tour">Curitiba Tour</option>
                  <option value="Sul Viagens & Receptivo">Sul Viagens & Receptivo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Grupo / Excursão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grupo Escolar Santo Anjo (45 pax)"
                  value={newHoldData.title}
                  onChange={(e) => setNewHoldData({ ...newHoldData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data da Visita</label>
                  <input
                    type="date"
                    required
                    value={newHoldData.date}
                    onChange={(e) => setNewHoldData({ ...newHoldData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vagas a Segurar</label>
                  <input
                    type="number"
                    min="5"
                    max="150"
                    required
                    value={newHoldData.spots}
                    onChange={(e) => setNewHoldData({ ...newHoldData, spots: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prazo de Retenção (TTL)</label>
                <select
                  value={newHoldData.hours}
                  onChange={(e) => setNewHoldData({ ...newHoldData, hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                >
                  <option value={12}>12 horas</option>
                  <option value={24}>24 horas (Padrão)</option>
                  <option value={48}>48 horas</option>
                  <option value={72}>72 horas (Exceção de Feriado)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Após esse prazo, os lugares não confirmados retornam de forma autônoma à disponibilidade geral.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewHoldModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Criar Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

