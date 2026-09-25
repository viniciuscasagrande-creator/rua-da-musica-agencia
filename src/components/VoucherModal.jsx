import React, { useState } from 'react';
import {
  X,
  QrCode,
  Printer,
  Download,
  CheckCircle,
  Building2,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';

export const VoucherModal = ({ booking, isOpen, onClose, onSimulateCheckin }) => {
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCheckin = () => {
    onSimulateCheckin && onSimulateCheckin(booking.id);
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-700 tracking-tight">Disk<span className="text-orange-600">Ingressos</span></span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-slate-700">Voucher B2B Oficial</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content (Printable Layout) */}
        <div className="p-6 space-y-4 text-xs bg-[#fafbfc]">
          
          {/* Card Frame */}
          <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-5 shadow-xs relative">
            
            {/* Top Attraction Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  ATRAÇÃO CULTURAL
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  Parque Jaime Lerner
                </h4>
                <p className="text-[11px] text-slate-500">Rua da Música • Curitiba - PR</p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Reservation & Group Info */}
            <div className="py-3 border-b border-slate-100 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Código da Reserva:</span>
                <span className="font-mono font-bold text-slate-800">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Agência Emissora:</span>
                <span className="font-semibold text-slate-800">{booking.agencyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grupo / Excursão:</span>
                <span className="font-bold text-blue-600">{booking.groupName}</span>
              </div>
            </div>

            {/* Date, Time & Quantity */}
            <div className="py-3 grid grid-cols-3 gap-2 border-b border-slate-100 text-center">
              <div className="bg-slate-50 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block">Data</span>
                <span className="font-bold text-slate-800">{booking.visitDate}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block">Horário</span>
                <span className="font-bold text-slate-800">{booking.visitTime}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block">Total</span>
                <span className="font-bold text-slate-800">{booking.ticketsCount} pax</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="pt-4 flex flex-col items-center justify-center text-center">
              <div className="w-36 h-36 bg-white border-2 border-slate-900 rounded-xl p-2 flex items-center justify-center shadow-xs">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
                  <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                  <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

                  <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
                  <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                  <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

                  <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
                  <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                  <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

                  <rect x="40" y="10" width="15" height="15" fill="#0f172a" />
                  <rect x="45" y="35" width="20" height="15" fill="#0f172a" />
                  <rect x="15" y="45" width="15" height="15" fill="#0f172a" />
                  <rect x="40" y="60" width="15" height="25" fill="#0f172a" />
                  <rect x="70" y="45" width="25" height="15" fill="#0f172a" />
                  <rect x="65" y="75" width="25" height="20" fill="#0f172a" />
                </svg>
              </div>

              <span className="font-mono text-[10px] text-slate-500 mt-2 tracking-wider">
                {booking.qrCode}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Apresente este código na catraca do Parque Jaime Lerner para validação instantânea.
              </p>
            </div>

            {/* Check-in status badge */}
            {checkinSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Check-in Validado com Sucesso!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {booking.ticketsCount} visitantes liberados na portaria do Parque Jaime Lerner.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-2">
          <button
            onClick={handleCheckin}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Simular Validação na Catraca</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
