import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  Briefcase,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Menu,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const Header = ({ currentView, onViewChange, operatorInfo }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Nova reserva de grupo B2B",
      desc: "Agência Turismo Brasil reservou 45 ingressos (Escola Positivo)",
      time: "10 min atrás",
      unread: true
    },
    {
      id: 2,
      title: "Cota atingida (80%)",
      desc: "Mundo Brasil Turismo consumiu 1.480 de 2.000 ingressos da cota",
      time: "45 min atrás",
      unread: true
    },
    {
      id: 3,
      title: "Check-in em lote realizado",
      desc: "Curitiba Tour validou 22 vouchers na entrada principal do Parque",
      time: "2h atrás",
      unread: true
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo + Sidebar Toggle */}
        <div className="flex items-center gap-4 min-w-[240px]">
          <button className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="flex items-center font-extrabold text-2xl tracking-tight">
              <span className="text-[#0252b4] font-black italic">Disk</span>
              <span className="text-[#ff5500] font-black italic ml-0.5">Ingressos</span>
            </div>
            <span className="hidden xl:inline-block text-[10px] font-medium text-slate-400 border-l border-slate-200 pl-2">
              B2B Turismo
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentView === 'operator' ? "Buscar agências, reservas, vouchers, pedidos..." : "Buscar produtos, datas, reservas..."}
              className="w-full pl-10 pr-12 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right: Switch Mode & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active View / Portal Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => onViewChange('operator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'operator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Painel do Operador</span>
            </button>
            <button
              onClick={() => onViewChange('agency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'agency'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Portal da Agência</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">Notificações B2B</span>
                  <span className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer">Marcar todas como lidas</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50">
                  <button className="text-xs text-blue-600 font-medium hover:underline">Ver todo o histórico de alertas</button>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Ajuda e Documentação do Sistema B2B"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Profile Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${
                currentView === 'operator' ? 'bg-[#0252b4]' : 'bg-emerald-600'
              }`}>
                {currentView === 'operator' ? 'PL' : 'AT'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentView === 'operator' ? 'Parque Jaime Lerner' : 'Agência Turismo Brasil'}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {currentView === 'operator' ? 'Administrador' : 'Agência Parceira'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">
                    {currentView === 'operator' ? 'Parque Jaime Lerner - Operador' : 'Agência Turismo Brasil'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentView === 'operator' ? 'operacoes@parquejaimelerner.curitiba.br' : 'reservas@turismobrasil.com.br'}
                  </p>
                </div>
                
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Alternar Modo
                  </div>
                  <button
                    onClick={() => {
                      onViewChange('operator');
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      currentView === 'operator' ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Painel do Operador (Parque)</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('agency');
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      currentView === 'agency' ? 'text-emerald-600 font-semibold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Portal da Agência de Turismo</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <a
                    href="#config"
                    className="block px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Configurações de Acesso (RBAC)
                  </a>
                  <a
                    href="#logout"
                    className="block px-4 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Sair do Sistema
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-lg">Distribuição Turística B2B</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="py-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-0.5">Modelo Integrado DiskIngressos PDT</h4>
                  <p className="text-blue-800">
                    O inventário de ingressos do Parque Jaime Lerner é centralizado. As agências reservam pacotes com taxa de 6% transparente, emitindo vouchers com QR Code válidos na entrada física do parque.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Como alternar entre as visões:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Painel do Operador:</strong> Gestão de cotas, faturamento, aprovação de agências e relatórios por estado.</li>
                  <li><strong>Portal da Agência:</strong> Wizard de reserva de 5 passos com escolha de datas, horários e emissão de vouchers para excursões.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-0.5">Composição do Preço B2B:</span>
                <span>Ingresso base (R$ 30,00) + Taxa DiskIngressos 6% (R$ 1,80) = <strong>R$ 31,80</strong> final para a agência.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
