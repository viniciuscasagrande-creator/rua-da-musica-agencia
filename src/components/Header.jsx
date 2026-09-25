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
  UserCheck,
  MapPin,
  Sparkles,
  X,
  Lock,
  LogOut,
  Download,
  Calendar,
  Layers,
  Settings
} from 'lucide-react';
import { ATTRACTIONS_LIST } from '../data/mockData';

export const Header = ({ currentView, onViewChange, operatorInfo }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showRbacModal, setShowRbacModal] = useState(false);
  const [headerToast, setHeaderToast] = useState(null);

  const initialNotifications = [
    {
      id: 1,
      title: "Nova reserva de grupo B2B",
      desc: "Agência Turismo Brasil reservou 45 ingressos (Escola Positivo)",
      time: "10 min atrás",
      unread: true,
      category: "Reservas"
    },
    {
      id: 2,
      title: "Cota atingida (80%)",
      desc: "Mundo Brasil Turismo consumiu 1.480 de 2.000 ingressos da cota",
      time: "45 min atrás",
      unread: true,
      category: "Comercial"
    },
    {
      id: 3,
      title: "Check-in em lote realizado",
      desc: "Curitiba Tour validou 22 vouchers na entrada principal do Parque",
      time: "2h atrás",
      unread: true,
      category: "Acesso"
    },
    {
      id: 4,
      title: "Holding expirado e devolvido",
      desc: "HOLD-779 (50 vagas) liberado para o inventário geral após TTL de 24h",
      time: "4h atrás",
      unread: false,
      category: "Inventário"
    },
    {
      id: 5,
      title: "Webhook transacional disparado",
      desc: "Status reserva.confirmada entregue com sucesso à Agência Viagens CWB",
      time: "6h atrás",
      unread: false,
      category: "Integração"
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const triggerToast = (msg) => {
    setHeaderToast(msg);
    setTimeout(() => setHeaderToast(null), 3500);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast("Todas as notificações foram marcadas como lidas.");
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const [activeAttraction, setActiveAttraction] = useState(ATTRACTIONS_LIST[0]);
  const [showAttractionMenu, setShowAttractionMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo + Attraction Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Menu de navegação e atalhos rápidos"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              RM
            </div>
            <div>
              <div className="flex items-center font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                Rua da Música
              </div>
              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase block">
                Portal de Agências
              </span>
            </div>
          </div>

          {/* Multi-Attraction Selector Dropdown */}
          <div className="relative hidden md:block border-l border-slate-200 pl-3">
            <button
              onClick={() => setShowAttractionMenu(!showAttractionMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Atração Ativa
                </span>
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  {activeAttraction.name}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {showAttractionMenu && (
              <div className="absolute left-3 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in duration-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Alternar Atrativo (Arquitetura Multi-Tenant)
                </span>
                <div className="space-y-1">
                  {ATTRACTIONS_LIST.map((att) => (
                    <button
                      key={att.id}
                      onClick={() => {
                        setActiveAttraction(att);
                        setShowAttractionMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        activeAttraction.id === att.id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-bold leading-tight">{att.name}</p>
                        <span className="text-[10px] text-slate-400">{att.city} - {att.state} • {att.category}</span>
                      </div>
                      {activeAttraction.id === att.id && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 px-2 block italic">
                    Tecnologia reutilizável para parques, museus e experiências turísticas.
                  </span>
                </div>
              </div>
            )}
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
              title="Notificações B2B"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">Notificações B2B</span>
                  {unreadCount > 0 ? (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      Marcar todas como lidas
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Todas lidas</span>
                  )}
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                      }}
                      className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3"
                    >
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">{n.category}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50">
                  <button
                    onClick={() => {
                      setShowAlertsModal(true);
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    Ver todo o histórico de alertas
                  </button>
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
                  <button
                    onClick={() => {
                      setShowRbacModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Configurações de Acesso (RBAC)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      triggerToast("Sessão B2B sincronizada e segura.");
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sair do Sistema</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile / Quick Navigation Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-start z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xs h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    RM
                  </div>
                  <span className="font-bold text-sm text-slate-900">Menu Principal</span>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Alternar Visão da Plataforma
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onViewChange('operator');
                      setShowMobileMenu(false);
                      triggerToast("Modo alternado para: Painel do Operador");
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      currentView === 'operator' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Painel do Operador (Parque)</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('agency');
                      setShowMobileMenu(false);
                      triggerToast("Modo alternado para: Portal da Agência");
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      currentView === 'agency' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Portal da Agência de Turismo</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Atalhos de Gestão
                </span>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowAlertsModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      Central de Alertas B2B
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowHelpModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    Ajuda & Regras de Negócio
                  </button>
                  <button
                    onClick={() => {
                      setShowRbacModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    Permissões & Segurança (RBAC)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
              <span className="block font-semibold text-slate-600">Parque Jaime Lerner • Rua da Música</span>
              <span>Curitiba - PR • Versão 2.4 B2B</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Alerts History Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Histórico Completo de Notificações & Alertas B2B</h4>
              </div>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Registro de auditoria dos eventos transacionais e cotas:</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 flex items-start gap-3 transition-colors">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${n.unread ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-300'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                        {n.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const csvData = "ID,Titulo,Descricao,Categoria,Momento\n" +
                    notifications.map(n => `${n.id},"${n.title}","${n.desc}","${n.category}","${n.time}"`).join('\n');
                  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `auditoria_alertas_b2b_${new Date().toISOString().slice(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  triggerToast("Log de auditoria exportado com sucesso (.csv)!");
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Log (.CSV)</span>
              </button>

              <button
                onClick={() => setShowAlertsModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RBAC Security Modal */}
      {showRbacModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Permissões de Acesso (RBAC)</h4>
              </div>
              <button
                onClick={() => setShowRbacModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Perfil de Acesso Atual</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {currentView === 'operator' ? 'Administrador Geral do Atrativo' : 'Operador de Vendas & Caravanas'}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block">● Autenticação Multi-Fator (2FA) Ativa</span>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">Escopos Habilitados para este perfil:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-semibold">
                    ✓ Reserva e Holding
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-semibold">
                    ✓ Vouchers Nominais
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-semibold">
                    ✓ Tarifário de Contratos
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-semibold">
                    ✓ Conciliação Financeira
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Qualquer alteração de privilégios de agência deve ser validada junto à diretoria comercial do Parque Jaime Lerner.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowRbacModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Header Toast Notification */}
      {headerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{headerToast}</span>
        </div>
      )}

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
                  <h4 className="font-semibold text-blue-900 mb-0.5">Plataforma B2B Parque Jaime Lerner</h4>
                  <p className="text-blue-800">
                    O inventário de ingressos do Parque Jaime Lerner é gerido de forma direta. As agências parceiras reservam pacotes comerciais, geram excursões e emitem ingressos nominais com QR Code validados nas catracas do parque.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Como alternar entre as visões:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Painel do Operador:</strong> Gestão de contratos, faturamento, homologação de agências e relatórios por estado.</li>
                  <li><strong>Portal da Agência:</strong> Wizard de reserva com escolha de datas, horários e emissão de vouchers para excursões.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-0.5">Composição Comercial:</span>
                <span>Ingresso base com condições comerciais e comissões definidas por contrato de cada agência parceira.</span>
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
