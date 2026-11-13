import React from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  RefreshCw
} from 'lucide-react';

export const TopNavbar = ({ activeSurface, onSurfaceChange, dbStatus, onRefreshDb }) => {
  const getProfileBadge = () => {
    if (activeSurface === 'operator') {
      return {
        initials: 'PL',
        name: 'Parque Jaime Lerner',
        role: 'Administrador',
        bg: 'bg-blue-600'
      };
    }
    if (activeSurface === 'agency') {
      return {
        initials: 'AT',
        name: 'Agência Turismo Brasil',
        role: 'Agência Parceira',
        bg: 'bg-blue-600'
      };
    }
    return {
      initials: 'VP',
      name: 'Vinicius Produtor',
      role: 'Produtor',
      bg: 'bg-blue-600'
    };
  };

  const profile = getProfileBadge();

  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* Main Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Brand & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            <div className="leading-none">
              <span className="text-xl font-black tracking-tight text-amber-500">Disk</span>
              <span className="text-xl font-black tracking-tight text-blue-700 italic">Ingressos</span>
              <span className="block text-[9px] text-slate-400 font-medium tracking-tight">
                Conectando pessoas a grandes experiências
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 w-72 lg:w-80 text-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={
                activeSurface === 'operator'
                  ? 'Buscar agências, reservas, vouchers, pedidos...'
                  : activeSurface === 'agency'
                  ? 'Buscar produtos, datas, reservas...'
                  : 'Pesquisar no evento... (Ctrl + K)'
              }
              className="bg-transparent w-full text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Center/Right: Surface Switcher + Sync + User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onSurfaceChange('operator')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSurface === 'operator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Painel do Operador</span>
            </button>
            <button
              onClick={() => onSurfaceChange('agency')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSurface === 'agency'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Portal da Agência</span>
            </button>
            <button
              onClick={() => onSurfaceChange('producer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSurface === 'producer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Produtor</span>
            </button>
          </div>

          {onRefreshDb && (
            <button
              onClick={onRefreshDb}
              title={
                dbStatus?.connected
                  ? 'Sincronizado com Neon PostgreSQL (Clique para atualizar)'
                  : 'Sincronizar dados B2B'
              }
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${dbStatus?.loading ? 'animate-spin text-blue-600' : 'text-emerald-600'}`}
              />
            </button>
          )}

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          <button className="hidden sm:flex p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div
              className={`w-8 h-8 rounded-full ${profile.bg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
            >
              {profile.initials}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 block">{profile.name}</span>
              <span className="text-[10px] text-slate-500 block">{profile.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
