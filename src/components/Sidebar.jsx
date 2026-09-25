import React from 'react';
import {
  LayoutDashboard,
  Ticket,
  Store,
  Briefcase,
  Users,
  CalendarRange,
  QrCode,
  DollarSign,
  Settings,
  Sparkles,
  MapPin,
  ChevronRight,
  FileText,
  Bus,
  Megaphone,
  Code,
  Package,
  ShoppingBag,
  FileSpreadsheet
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange, activeSubTab, onSubTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agencias', label: 'Agências', icon: Users },
    { id: 'condicoes-comerciais', label: 'Condições Comerciais', icon: FileText },
    { id: 'produtos-pacotes', label: 'Produtos e Pacotes', icon: Package },
    { id: 'reservas-grupos', label: 'Reservas e Grupos', icon: Bus },
    { id: 'vendas', label: 'Vendas', icon: ShoppingBag },
    { id: 'acessos', label: 'Acessos', icon: QrCode },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet },
    { id: 'integracoes', label: 'Integrações', icon: Code },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Operator / Venue Profile Card */}
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
                Parque Cultural
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

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeSubTab === item.id || (item.id === 'dashboard' && activeSubTab === 'visao-geral');

          return (
            <button
              key={item.id}
              onClick={() => onSubTabChange(item.id)}
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

      {/* Bottom Promo Banner */}
      <div className="p-3 mt-auto">
        <div className="rounded-xl overflow-hidden border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-3.5 shadow-xs relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 leading-tight">Mais turistas para a cultura brasileira</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-2.5">
            Parcerias que conectam destinos, operadores e agências em todo o Brasil.
          </p>
          
          <div className="rounded-lg overflow-hidden relative h-16 border border-slate-200">
            <img
              src="/assets/sidebar-bottom-promo.jpg"
              alt="Música Arte Natureza Curitiba"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
              <span className="text-[9px] font-extrabold tracking-widest text-white uppercase drop-shadow">
                MÚSICA • ARTE • NATUREZA
              </span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
