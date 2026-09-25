import React, { useState } from 'react';
import {
  Users,
  FileSpreadsheet,
  QrCode,
  Download,
  Upload,
  CheckCircle,
  Plus,
  Bus,
  Search,
  UserCheck,
  Calendar,
  Clock,
  Printer,
  FileText
} from 'lucide-react';
import { GROUP_RESERVATIONS_WITH_MANIFEST } from '../../data/mockData';

export const GroupsManifestTab = () => {
  const [groups, setGroups] = useState(GROUP_RESERVATIONS_WITH_MANIFEST);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSimulatePassengerCheckin = (paxId) => {
    setSelectedGroup(prev => ({
      ...prev,
      passengers: prev.passengers.map(p =>
        p.id === paxId ? { ...p, checkin: !p.checkin } : p
      )
    }));
    notify("Status de embarque/catraca do passageiro atualizado!");
  };

  const handleToggleVoucherMode = () => {
    const newMode = selectedGroup.voucherMode === 'VOUCHER_MASTER' ? 'INDIVIDUAL' : 'VOUCHER_MASTER';
    setSelectedGroup(prev => ({ ...prev, voucherMode: newMode }));
    notify(`Modo de voucher alterado para: ${newMode === 'VOUCHER_MASTER' ? 'Voucher Master Unificado (1 QR Code)' : 'Ingressos Nominais Individuais'}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" />
            <span>Operações de Turismo B2B • Grupo → Reserva → Passageiros → Ingressos</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Grupos, Excursões & Manifesto de Passageiros
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            A agência cadastra a excursão em lote e envia o manifesto nominal de passageiros (via planilha Excel ou API). Emita um <strong>Voucher Master</strong> consolidado para o ônibus todo ou bilhetes individuais nominais.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Importar Lista (.xlsx / .csv)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Group Selector & Right Passenger Rooming List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Excursions List (Col-4) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Excursões Agendadas ({groups.length})
          </h3>

          <div className="space-y-2.5">
            {groups.map((grp) => {
              const isSelected = selectedGroup?.id === grp.id;

              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-blue-700 font-bold bg-blue-100/60 px-2 py-0.5 rounded">
                      {grp.bookingCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {grp.visitDate}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{grp.groupName}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{grp.agencyName}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">
                      Passageiros: <strong>{grp.totalPassengers}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      grp.voucherMode === 'VOUCHER_MASTER'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {grp.voucherMode === 'VOUCHER_MASTER' ? 'Voucher Master (1 QR)' : 'Ingressos Individuais'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Passenger Manifest & Master Voucher Controls (Col-8) */}
        {selectedGroup && (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Group Summary Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{selectedGroup.groupName}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">
                    {selectedGroup.totalPassengers} passageiros
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Responsável: <strong>{selectedGroup.responsibleName}</strong> • {selectedGroup.responsiblePhone}
                </p>
              </div>

              {/* Master vs Individual Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleVoucherMode}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Alternar Modo de Emissão</span>
                </button>

                <button
                  onClick={() => notify(`Imprimindo manifesto completo de ${selectedGroup.groupName}...`)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
                  title="Imprimir Manifesto"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Master QR Code Preview Card */}
            {selectedGroup.voucherMode === 'VOUCHER_MASTER' && (
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                    Voucher Master Unificado de Excursão (Catraca em Bloco)
                  </span>
                  <h4 className="text-lg font-bold">1 Único QR Code para {selectedGroup.totalPassengers} pessoas</h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    O guia turístico apresenta este QR Code no leitor da catraca do Parque Jaime Lerner. O sistema libera o giro automático de {selectedGroup.totalPassengers} catracas com validação HMAC-SHA256 instantânea.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 text-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-20 h-20 text-white" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-600 block mt-1 font-bold">
                    {selectedGroup.masterQrCode.slice(0, 18)}...
                  </span>
                </div>
              </div>
            )}

            {/* Passenger List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-800">
                    Lista Nominal de Passageiros (Manifesto de Excursão)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedGroup.passengers.length} passageiros cadastrados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Passageiro</th>
                      <th className="py-2.5 px-4">Documento</th>
                      <th className="py-2.5 px-4">Categoria</th>
                      <th className="py-2.5 px-4">Assento / Tag</th>
                      <th className="py-2.5 px-4 text-center">Catraca / Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedGroup.passengers.map((pax) => (
                      <tr key={pax.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {pax.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {pax.doc}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            pax.type.includes('GUIA')
                              ? 'bg-purple-100 text-purple-700'
                              : pax.type.includes('ESTUDANTE')
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {pax.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {pax.seat || 'Livre'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleSimulatePassengerCheckin(pax.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              pax.checkin
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            {pax.checkin ? '✓ Embarcado' : 'Pendente'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Import Spreadsheet Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Importar Manifesto de Passageiros
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Selecione ou arraste a planilha (.xlsx ou .csv) contendo os passageiros da excursão. As colunas devem conter: <code>Nome Completo</code>, <code>CPF/Documento</code>, <code>Categoria (Inteira/Estudante/Idoso)</code> e <code>Poltrona</code>.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Clique para selecionar o arquivo da agência</p>
                <span className="text-[11px] text-slate-400 mt-1 block">ou arraste para esta área (.xlsx, .csv até 10MB)</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href="#modelo"
                  onClick={(e) => { e.preventDefault(); notify("Baixando modelo padronizado de planilha..."); }}
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Modelo Padronizado</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      notify("Planilha processada com sucesso! 45 passageiros validados.");
                      setIsImportModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Confirmar Importação
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
