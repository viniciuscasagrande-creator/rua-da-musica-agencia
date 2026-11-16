import React, { useState } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  Printer,
  Download,
  ShieldCheck
} from 'lucide-react';

export const VoucherModal = ({ booking, hideDiskFee = false, onCheckin, onClose }) => {
  const [checkedIn, setCheckedIn] = useState(booking?.status === 'Concluído');

  if (!booking) return null;

  const handleToggleCheckin = () => {
    const nextState = !checkedIn;
    setCheckedIn(nextState);
    if (onCheckin) {
      onCheckin(booking.id, nextState);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <div className="bg-white px-2 py-0.5 rounded shadow-xs">
                  <img
                    src="/assets/logo-vale-color-h.png"
                    alt="Vale da Música"
                    className="h-4 w-auto object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  VOUCHER OFICIAL B2B • DISKINGRESSOS
                </span>
              </div>
              <h3 className="text-lg font-extrabold">Parque Jaime Lerner — Vale da Música</h3>
              <p className="text-xs text-slate-300">Ópera de Arame & Rua da Música • Curitiba - PR</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src="/assets/logo-vale-ondas.png"
            alt="Ondas Vale da Música"
            className="h-3 w-48 object-contain object-left mt-2.5 opacity-90"
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* QR & Key Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-32 h-32 bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-20 h-20 text-slate-900" />
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                {booking.qrCode || booking.id}
              </span>
            </div>

            <div className="space-y-2 text-xs w-full">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Reserva:</span>
                <span className="font-mono font-bold text-blue-600">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Agência:</span>
                <span className="font-bold text-slate-900">{booking.agencyName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Grupo:</span>
                <span className="font-semibold text-slate-800 text-right">{booking.groupName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Data e Horário:</span>
                <span className="font-bold text-slate-900">
                  {booking.visitDate} às {booking.visitTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Visitantes:</span>
                <span className="font-extrabold text-emerald-700">
                  {booking.ticketsCount} ingressos
                </span>
              </div>
            </div>
          </div>

          {/* Financial Composition */}
          <div className="border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
            <div className="font-bold text-slate-800 mb-1">
              {hideDiskFee ? 'Resumo Financeiro da Reserva B2B' : 'Composição Financeira (Ledger PDT)'}
            </div>
            {!hideDiskFee && (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>Valor Base Operador (Parque Jaime Lerner)</span>
                  <span>
                    R${' '}
                    {(booking.baseAmount || booking.totalAmount / 1.06).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxa Administrativa DiskIngressos (6%)</span>
                  <span>
                    R${' '}
                    {(
                      booking.diskFeeAmount ||
                      booking.totalAmount - booking.totalAmount / 1.06
                    )
                      .toFixed(2)
                      .replace('.', ',')}
                  </span>
                </div>
              </>
            )}
            <div className={`flex justify-between font-black text-slate-900 ${!hideDiskFee ? 'pt-1.5 border-t border-slate-100' : ''}`}>
              <span>Valor Total B2B</span>
              <span>R$ {booking.totalAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Check-in Simulation */}
          <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Status na Catraca: {checkedIn ? 'Check-in Realizado' : booking.status}
                </span>
                <span className="text-[11px] text-slate-600">
                  Validação sincronizada com o estoque único do Parque
                </span>
              </div>
            </div>
            {onCheckin && (
              <button
                onClick={handleToggleCheckin}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  checkedIn
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {checkedIn ? 'Validado ✓' : 'Simular Check-in'}
              </button>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Lote</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
