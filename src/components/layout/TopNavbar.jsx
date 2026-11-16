import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  RefreshCw,
  CheckCheck,
  QrCode,
  DollarSign,
  CalendarCheck,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    surface: 'agency',
    title: 'Voucher B2B emitido: RES-B2B-1049',
    description: 'Excursão Colégio Positivo (45 pax) liberada para check-in na catraca.',
    time: 'Há 12 min',
    unread: true,
    type: 'voucher'
  },
  {
    id: 'notif-2',
    surface: 'operator',
    title: 'Pré-reserva aguardando confirmação',
    description: 'Viva Viagens (RES-B2B-1046 • 50 ingressos) expira em 24h.',
    time: 'Há 38 min',
    unread: true,
    type: 'booking'
  },
  {
    id: 'notif-3',
    surface: 'producer',
    title: 'Meta atingida na Equipe de Vendas',
    description: 'Promoter João Silva atingiu 94% da meta (312 ingressos vendidos).',
    time: 'Há 1 hora',
    unread: true,
    type: 'commission'
  },
  {
    id: 'notif-4',
    surface: 'operator',
    title: 'Repasse Semanal Conciliado (Ledger PDT)',
    description: 'Lote #37 liquidado com retenção contratual de 6% (600 bps).',
    time: 'Ontem às 17:00',
    unread: false,
    type: 'commission'
  }
];

export const TopNavbar = ({
  activeSurface,
  onSurfaceChange,
  session,
  onLogout,
  dbStatus,
  onRefreshDb,
  notifications: externalNotifications,
  onMarkAllRead,
  onNotificationClick
}) => {
  const isAdmin = session?.role === 'ADMIN';
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const helpRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = externalNotifications || localNotifications;
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setOpenHelp(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(false);
        setOpenNotif(false);
        setOpenHelp(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleMarkAllAsRead = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
    } else {
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const handleItemClick = (item) => {
    if (onNotificationClick) {
      onNotificationClick(item);
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );
      if (item.surface && onSurfaceChange) {
        onSurfaceChange(item.surface);
      }
    }
    setOpenNotif(false);
  };

  const renderNotifIcon = (type) => {
    if (type === 'voucher') return <QrCode className="w-4 h-4 text-blue-600" />;
    if (type === 'commission') return <DollarSign className="w-4 h-4 text-emerald-600" />;
    return <CalendarCheck className="w-4 h-4 text-amber-600" />;
  };

  const getProfileBadge = () => {
    if (session?.name) {
      const parts = session.name.trim().split(' ');
      const initials =
        parts.length > 1
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : session.name.slice(0, 2).toUpperCase();
      return {
        initials,
        name: session.name,
        role: session.roleTitle || session.role,
        bg: isAdmin ? 'bg-slate-900' : 'bg-blue-600'
      };
    }
    if (activeSurface === 'operator') {
      return {
        initials: 'PL',
        name: 'Parque Jaime Lerner',
        role: 'Operador',
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
          <div className="flex items-center gap-2.5 relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpenMenu((v) => !v)}
              title="Menu Rápido de Módulos"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                openMenu ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onSurfaceChange('agency')}
              className="leading-none text-left cursor-pointer"
            >
              <span className="text-xl font-black tracking-tight text-amber-500">Disk</span>
              <span className="text-xl font-black tracking-tight text-blue-700 italic">Ingressos</span>
              <span className="block text-[9px] text-slate-400 font-medium tracking-tight">
                Conectando pessoas a grandes experiências
              </span>
            </button>

            {openMenu && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 text-xs space-y-1">
                {isAdmin ? (
                  <>
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Navegação Administrador (3 Ambientes)
                    </div>
                    {[
                      {
                        id: 'operator',
                        label: '1. Painel do Operador (Parque)',
                        sub: 'Estoque, Agências, Catraca e Split'
                      },
                      {
                        id: 'agency',
                        label: '2. Portal da Agência B2B',
                        sub: 'Compra de Lotes, Vouchers e Kit Mídia'
                      },
                      {
                        id: 'producer',
                        label: '3. Painel do Produtor (Vendas)',
                        sub: 'Promoters, Links, Cupons e Ledger'
                      }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onSurfaceChange(m.id);
                          setOpenMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          activeSurface === m.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{m.label}</div>
                        <div className="text-[10px] text-slate-500">{m.sub}</div>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-3 py-2 text-slate-600">
                    <div className="font-bold text-slate-900">Ambiente Isolado ({session?.role})</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {session?.agencyName || session?.roleTitle}
                    </div>
                  </div>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 border-t border-slate-100 pt-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Voltar à Central de Acessos (/)</span>
                  </button>
                )}
              </div>
            )}
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

        {/* Center/Right: Surface Switcher (ONLY for ADMIN) or Isolated Environment Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
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
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">
                {activeSurface === 'agency'
                  ? `Portal da Agência • ${session?.agencyName || 'Agência Turismo Brasil'}`
                  : activeSurface === 'operator'
                  ? 'Painel Operacional • Parque Jaime Lerner'
                  : 'Painel Comercial do Produtor'}
              </span>
            </div>
          )}

          {/* Notification Bell + Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setOpenNotif((prev) => !prev)}
              title="Notificações Operacionais"
              className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                openNotif
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {openNotif && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold">Central de Notificações PDT</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                        {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-blue-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                        title="Marcar todas como lidas"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Ler todas</span>
                      </button>
                    )}
                    <button
                      onClick={() => setOpenNotif(false)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                          item.unread
                            ? 'bg-blue-50/50 hover:bg-blue-50'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                          {renderNotifIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.title}
                            </span>
                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                            {item.time}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    Status DB: {dbStatus?.connected ? 'Online (Neon)' : 'Local PDT'}
                  </span>
                  {onRefreshDb && (
                    <button
                      onClick={() => {
                        onRefreshDb();
                        setOpenNotif(false);
                      }}
                      className="text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      Sincronizar agora
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Dropdown */}
          <div className="relative hidden sm:block" ref={helpRef}>
            <button
              onClick={() => {
                setOpenHelp((prev) => !prev);
                setOpenNotif(false);
                setOpenProfile(false);
              }}
              title="Central de Ajuda B2B"
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                openHelp ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {openHelp && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 shadow-xl z-50 p-4 space-y-2.5 text-xs">
                <div className="font-bold text-slate-900">Suporte B2B • Parque Jaime Lerner</div>
                <p className="text-[11px] text-slate-600">
                  Plantão comercial para agências credenciadas, grupos e equipe de vendas PDT.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
                  <div>
                    <span className="text-slate-500">WhatsApp B2B:</span>{' '}
                    <strong className="text-slate-900">(41) 99233-8800</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Telefone:</span>{' '}
                    <strong className="text-slate-900">(41) 3039-2030</strong>
                  </div>
                  {activeSurface !== 'agency' && (
                    <div>
                      <span className="text-slate-500">Taxa Adm. PDT:</span>{' '}
                      <strong className="text-blue-700">6,0% (600 bps)</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setOpenProfile((prev) => !prev);
                setOpenNotif(false);
                setOpenHelp(false);
              }}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer"
            >
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
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 shadow-xl z-50 p-2 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Sessão Autenticada ({session?.role || 'PORTAL'})
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5">{profile.name}</span>
                  {session?.email && (
                    <span className="text-[11px] text-slate-500 block truncate">{session.email}</span>
                  )}
                </div>

                {isAdmin && (
                  <>
                    <div className="px-3 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Alternar Ambiente (Admin)
                    </div>
                    {[
                      { id: 'operator', name: 'Parque Jaime Lerner', role: '1. Painel do Operador' },
                      { id: 'agency', name: 'Agência Turismo Brasil', role: '2. Portal da Agência' },
                      { id: 'producer', name: 'Vinicius Produtor', role: '3. Painel do Produtor' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSurfaceChange(p.id);
                          setOpenProfile(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          activeSurface === p.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.role}</div>
                      </button>
                    ))}
                  </>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenProfile(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 border-t border-slate-100 pt-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Trocar Acesso / Sair</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-bar: Architecture Context & Surface Selector (Seletor visível apenas para ADMIN) */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[10px] font-bold">
            Perfil: {session?.role || 'PORTAL'}
          </span>
          {session?.role === 'AGENCIA' && session?.agencyId && (
            <span className="text-slate-300">
              Isolamento de Dados Ativo: <strong>{session.agencyName} ({session.agencyId})</strong>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isAdmin ? (
            <>
              <span className="text-slate-400 mr-1">Alternar Ambiente (Admin):</span>
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
            </>
          ) : (
            onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Central de Acessos (/)</span>
              </button>
            )
          )}
          {onRefreshDb && (
            <button
              onClick={onRefreshDb}
              title="Sincronizar com o banco de dados"
              className="p-1 ml-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${dbStatus?.loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
