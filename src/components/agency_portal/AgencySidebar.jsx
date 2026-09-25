import React from 'react';
import {
  Ticket,
  Calendar,
  QrCode,
  Users,
  DollarSign,
  Building,
  Megaphone,
  MessageSquare,
  HelpCircle,
  MapPin,
  Sparkles,
  Code
} from 'lucide-react';

export const AgencySidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'comprar', label: 'Nova Reserva / Ingressos', icon: Ticket },
    { id: 'reservas', label: 'Minhas Reservas', icon: Calendar },
    { id: 'vouchers', label: 'Meus Vouchers', icon: QrCode },
    { id: 'grupos', label: 'Grupos e Excursões', icon: Users },
    { id: 'financeiro', label: 'Extrato Financeiro', icon: DollarSign },
    { id: 'dados', label: 'Dados da Agência', icon: Building },
    { id: 'materiais', label: 'Materiais de Divulgação', icon: Megaphone },
    { id: 'api', label: 'Minha API & Webhooks', icon: Code },
    { id: 'contato', label: 'Fale com o Parque', icon: MessageSquare },
    { id: 'ajuda', label: 'Ajuda e Suporte', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Attraction Header Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex flex-col gap-2">
          <div className="relative w-full h-24 rounded-xl overflow-hidden shadow-xs border border-slate-200 group">
            <img
              src="/assets/parque-thumb.jpg"
              alt="Parque Jaime Lerner - Rua da Música"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 left-2 right-2 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 bg-blue-900/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                Canal Agências B2B
              </span>
            </div>
          </div>
          
          <div className="px-0.5">
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Parque Jaime Lerner</h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Rua da Música • Curitiba - PR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Navigation Menu */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Promo Footer: Parque Jaime Lerner */}
      <div className="p-3 mt-auto">
        <div className="rounded-xl overflow-hidden relative h-36 border border-slate-800 shadow-sm group">
          <img
            src="/assets/parque-sunset.jpg"
            alt="Música Arte Natureza Experiências"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-3 text-white">
            <span className="text-[9px] font-bold tracking-widest text-orange-400 uppercase">
              MÚSICA • ARTE • NATUREZA
            </span>
            <span className="text-[8px] font-semibold tracking-wider text-slate-300 uppercase">
              EXPERIÊNCIAS
            </span>
            <h4 className="text-xs font-black tracking-wide text-white uppercase mt-0.5">
              PARQUE JAIME LERNER
            </h4>
          </div>
        </div>
      </div>

    </aside>
  );
};
