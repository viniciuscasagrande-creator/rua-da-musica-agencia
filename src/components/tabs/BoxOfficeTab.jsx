import React from 'react';
import {
  Store,
  QrCode,
  Users,
  CheckCircle,
  Wifi,
  DollarSign,
  Ticket,
  Clock,
  MapPin
} from 'lucide-react';
import { TURNSTILES_DATA } from '../../data/mockData';

export const BoxOfficeTab = () => {
  const totalTodayCheckins = TURNSTILES_DATA.reduce((acc, c) => acc + c.todayCheckins, 0);

  return (
    <div className="space-y-6">
      
      {/* 3 Box Office KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Check-ins Hoje no Parque</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {totalTodayCheckins.toLocaleString('pt-BR')} pessoas
          </span>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            Portarias operando com fluidez normal
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Vendas no Guichê Físico</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">R$ 21.300,00</span>
          <p className="text-[11px] text-slate-400 mt-1">
            710 ingressos emitidos localmente
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Catracas Online</span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">4 / 4 Ativas</span>
          <p className="text-[11px] text-slate-400 mt-1">
            Sincronização instantânea com PDT
          </p>
        </div>
      </div>

      {/* Catracas Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Controle de Catracas & Validação de Acesso</h4>
            <p className="text-xs text-slate-500">Monitoramento em tempo real dos leitores ópticos de QR Code nas entradas físicas</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Rede Local Operacional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TURNSTILES_DATA.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-600">{cat.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {cat.status}
                </span>
              </div>

              <div>
                <h5 className="font-bold text-slate-800">{cat.name}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{cat.location}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-600">
                <span>Check-ins hoje:</span>
                <span className="font-extrabold text-sm text-slate-900">{cat.todayCheckins}</span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Vazão: {cat.capacityPerHour} pax/h</span>
                <span>IP: {cat.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
