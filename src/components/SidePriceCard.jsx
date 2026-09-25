import React from 'react';
import {
  Tag,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { OPERATIONAL_PIPELINE_STEPS } from '../data/mockData';

export const SidePriceCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      
      {/* Top Banner Card: Parque Jaime Lerner */}
      <div className="relative h-44 w-full group overflow-hidden">
        <img
          src="/assets/parque-banner.jpg"
          alt="Parque Jaime Lerner - Rua da Música"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">
            PARQUE
          </span>
          <h2 className="text-xl font-extrabold leading-tight text-white drop-shadow">
            JAIME LERNER
          </h2>
          <p className="text-xs text-slate-200 mt-0.5">
            Rua da Música • Curitiba - PR
          </p>

          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 backdrop-blur-xs border border-white/20 text-slate-100">
            Cultura, música e experiências inesquecíveis
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Composição do Preço (B2B) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Composição do Preço (B2B)</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Ingresso Parque Jaime Lerner (Inteira)</span>
              <span className="font-semibold text-slate-800">R$ 30,00</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Taxa administrativa DiskIngressos (6%)</span>
              <span className="font-semibold text-slate-800">R$ 1,80</span>
            </div>

            {/* Total do ingresso B2B Box */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex justify-between items-center text-blue-900">
              <span className="font-bold text-xs">Total do ingresso B2B</span>
              <span className="font-black text-base text-blue-700">R$ 31,80</span>
            </div>

            {/* Optional Agency Services Card */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 mt-2.5 flex items-start gap-2.5">
              <Briefcase className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-800 block">Serviços da agência (opcional)</span>
                <span className="text-slate-500">Transporte, hotel, guia, alimentação, etc. Definidos pela agência.</span>
              </div>
            </div>

            {/* Final Package Price */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-emerald-900 block">Preço final do pacote</span>
                <span className="text-emerald-700">Calculado após inclusão dos serviços da agência</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fluxo de Funcionamento */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-blue-600 font-black text-sm">#</span>
            <h3 className="font-bold text-sm text-slate-900">Fluxo de Funcionamento</h3>
          </div>

          <div className="space-y-3">
            {OPERATIONAL_PIPELINE_STEPS.map((item) => (
              <div key={item.step} className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
