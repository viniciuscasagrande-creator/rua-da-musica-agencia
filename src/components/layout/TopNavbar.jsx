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
  Database,
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
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
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

        {/* Center/Right: Surface Switcher + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onSurfaceChange('operator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSurface === 'producer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Produtor</span>
            </button>
          </div>

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

      {/* Sub-bar: Architecture Context & Surface Selector (Matching video 00:25) */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          {onRefreshDb && (
            <button
              onClick={onRefreshDb}
              title="Sincronizar com Neon PostgreSQL"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${dbStatus?.loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 mr-1">Ativar Superfície:</span>
          <button
            onClick={() => onSurfaceChange('operator')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-all cursor-pointer ${
              activeSurface === 'operator'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Operador (Parque)
          </button>
          <button
            onClick={() => onSurfaceChange('agency')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-all cursor-pointer ${
              activeSurface === 'agency'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. Portal da Agência
          </button>
          <button
            onClick={() => onSurfaceChange('producer')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-all cursor-pointer ${
              activeSurface === 'producer'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            3. Produtor (Equipe Vendas)
          </button>
        </div>
      </div>
    </header>
  );
};
