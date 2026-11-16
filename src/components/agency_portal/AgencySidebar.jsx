import React from 'react';
import {
  CalendarPlus,
  ClipboardList,
  QrCode,
  Users,
  DollarSign,
  Building2,
  Image,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export const AgencySidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'comprar', label: 'Comprar Ingressos', icon: CalendarPlus },
    { id: 'reservas', label: 'Minhas Reservas', icon: ClipboardList },
    { id: 'vouchers', label: 'Meus Vouchers', icon: QrCode },
    { id: 'grupos', label: 'Grupos e Excursões', icon: Users },
    { id: 'financeiro', label: 'Extrato Financeiro', icon: DollarSign },
    { id: 'dados', label: 'Dados da Agência', icon: Building2 },
    { id: 'materiais', label: 'Materiais de Divulgação', icon: Image },
    { id: 'contato', label: 'Fale com o Parque', icon: MessageCircle },
    { id: 'ajuda', label: 'Ajuda e Suporte', icon: HelpCircle }
  ];

  return (
    <aside className="w-full xl:w-64 bg-white border-b xl:border-b-0 xl:border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-4">
        {/* Top Attraction Card */}
        <div className="rounded-xl overflow-hidden bg-slate-900 text-white shadow-xs border border-slate-800">
          <div className="aspect-video overflow-hidden relative bg-slate-950">
            <img
              src="/assets/vale-aerea-dourada.png"
              alt="Parque Jaime Lerner - Vale da Música"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-2 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/95 text-white shadow-xs">
              Canal Oficial B2B
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            <div className="bg-white px-2 py-1 rounded-md inline-flex items-center">
              <img
                src="/assets/logo-vale-color-h.png"
                alt="Vale da Música"
                className="h-4 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Parque Jaime Lerner</h2>
              <p className="text-[11px] text-slate-300 mt-0.5">Vale da Música • Rua da Música</p>
              <p className="text-[11px] text-slate-400">Curitiba - PR</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promotional Poster (Identidade Visual Oficial Vale da Música — Sem Corte) */}
      <div className="hidden xl:block mt-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-white shadow-xs">
        <div className="aspect-3/2 w-full bg-slate-900 overflow-hidden">
          <img
            src="/assets/vale-palco-flutuante.jpg"
            alt="Vale da Música - Palco Flutuante"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-3.5 space-y-2">
          <div className="bg-white px-2.5 py-1 rounded-lg inline-flex items-center">
            <img
              src="/assets/logo-vale-color-v.png"
              alt="Vale da Música"
              className="h-5 w-auto object-contain"
            />
          </div>
          <div className="text-[11px] font-extrabold tracking-wider text-blue-300 leading-snug uppercase">
            MÚSICA • ARTE • NATUREZA • EXPERIÊNCIAS
          </div>
          <img
            src="/assets/logo-vale-ondas.png"
            alt="Ondas sonoras Vale da Música"
            className="h-3.5 w-full object-contain object-left opacity-95"
          />
          <div className="pt-1.5 border-t border-white/15">
            <span className="text-[11px] font-black tracking-tight block text-white">
              PARQUE JAIME LERNER
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
