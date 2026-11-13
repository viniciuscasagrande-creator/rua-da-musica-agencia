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
          <div className="h-24 overflow-hidden relative">
            <img
              src="/assets/parque-thumb.jpg"
              alt="Parque Jaime Lerner"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/90 text-white">
              Canal Oficial B2B
            </span>
          </div>
          <div className="p-3">
            <h2 className="font-bold text-sm text-white leading-tight">Parque Jaime Lerner</h2>
            <p className="text-[11px] text-slate-300 mt-0.5">Rua da Música</p>
            <p className="text-[11px] text-slate-400">Curitiba - PR</p>
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

      {/* Bottom Promotional Poster (Exact replica of screenshot 11_30_25) */}
      <div className="hidden xl:block mt-6 rounded-xl overflow-hidden relative border border-slate-800 bg-slate-950 text-white">
        <img
          src="/assets/parque-sunset.jpg"
          alt="Parque Jaime Lerner Experiências"
          className="w-full h-48 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent p-4 flex flex-col justify-end">
          <div className="text-[11px] font-extrabold tracking-wider text-blue-300 leading-snug uppercase">
            MÚSICA<br />ARTE<br />NATUREZA<br />EXPERIÊNCIAS
          </div>
          <div className="mt-2 pt-2 border-t border-white/20">
            <span className="text-xs font-black tracking-tight block text-white">
              PARQUE JAIME LERNER
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
