import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  Lock,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { AGENCIES_LIST, AGENCY_USERS_LIST } from '../../data/mockData';

const PORTAL_CARDS = [
  {
    id: 'agencia',
    path: '/agencia',
    role: 'AGENCIA',
    title: 'Agência',
    description: 'Reservas, excursões, vouchers e cotas',
    badge: 'Portal Exclusivo por Agência',
    icon: Briefcase,
    accent: 'from-blue-600 to-blue-700',
    borderHover: 'hover:border-blue-500',
    iconBg: 'bg-blue-600'
  },
  {
    id: 'operador',
    path: '/operador',
    role: 'OPERADOR',
    title: 'Operador',
    description: 'Agências, ingressos, estoque e check-in',
    badge: 'Parque Jaime Lerner',
    icon: Building2,
    accent: 'from-emerald-600 to-teal-700',
    borderHover: 'hover:border-emerald-500',
    iconBg: 'bg-emerald-600'
  },
  {
    id: 'produtor',
    path: '/produtor',
    role: 'PRODUTOR',
    title: 'Produtor',
    description: 'Equipe comercial, vendas e comissões',
    badge: 'Gestão Comercial & Ledger',
    icon: Users,
    accent: 'from-purple-600 to-indigo-700',
    borderHover: 'hover:border-purple-500',
    iconBg: 'bg-purple-600'
  },
  {
    id: 'admin',
    path: '/admin',
    role: 'ADMIN',
    title: 'Administrador',
    description: 'Acesso completo aos três ambientes',
    badge: 'Visão Global Multi-Ambiente',
    icon: ShieldCheck,
    accent: 'from-amber-500 to-orange-600',
    borderHover: 'hover:border-amber-500',
    iconBg: 'bg-slate-900'
  }
];

export const AccessHub = ({
  currentPath = '/',
  onNavigate,
  onLoginSuccess,
  agencyUsers = AGENCY_USERS_LIST,
  agencies = AGENCIES_LIST
}) => {
  const activeRouteKey = currentPath.replace(/^\//, '').toLowerCase();
  const selectedPortal = PORTAL_CARDS.find((c) => c.id === activeRouteKey) || null;

  const [selectedAgencyUserId, setSelectedAgencyUserId] = useState(
    agencyUsers[0]?.id || 'USR-AG-01'
  );
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [submitting, setSubmitting] = useState(false);

  const selectedAgencyUser =
    agencyUsers.find((u) => u.id === selectedAgencyUserId) || agencyUsers[0];

  const getDefaultEmailForRole = (role) => {
    if (role === 'AGENCIA') return selectedAgencyUser?.email || 'b2b@turismobrasil.com.br';
    if (role === 'OPERADOR') return 'operacao@parquejaimelerner.curitiba.br';
    if (role === 'PRODUTOR') return 'comercial@valedamusica.com.br';
    return 'admin@diskingressos.com.br';
  };

  const handleSelectPortalCard = (card) => {
    setEmailInput('');
    onNavigate(card.path);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPortal) return;
    setSubmitting(true);

    const role = selectedPortal.role;
    const targetAgency =
      role === 'AGENCIA'
        ? agencies.find((a) => a.id === selectedAgencyUser?.agencyId) || agencies[5] || agencies[0]
        : null;

    const loginPayload = {
      action: 'login',
      role,
      userId:
        role === 'AGENCIA'
          ? selectedAgencyUser?.id
          : `USR-${role}-01`,
      userName:
        role === 'AGENCIA'
          ? selectedAgencyUser?.name
          : role === 'OPERADOR'
          ? 'Parque Jaime Lerner'
          : role === 'PRODUTOR'
          ? 'Vinicius Produtor'
          : 'Administrador Geral',
      email: emailInput || getDefaultEmailForRole(role),
      roleTitle:
        role === 'AGENCIA'
          ? `${selectedAgencyUser?.roleTitle} • ${targetAgency?.name}`
          : role === 'OPERADOR'
          ? 'Operações & Catraca'
          : role === 'PRODUTOR'
          ? 'Equipe Comercial & Comissões'
          : 'Administrador Global (3 Ambientes)',
      agencyId: role === 'AGENCIA' ? targetAgency?.id || 'AG-006' : null,
      agencyName: role === 'AGENCIA' ? targetAgency?.name || 'Agência Turismo Brasil' : null
    };

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.session) {
          onLoginSuccess({
            ...data.session,
            token: data.token
          });
          setSubmitting(false);
          return;
        }
      }
    } catch {
      // Fallback local session if offline
    }

    onLoginSuccess({
      userId: loginPayload.userId,
      role: loginPayload.role,
      name: loginPayload.userName,
      email: loginPayload.email,
      roleTitle: loginPayload.roleTitle,
      agencyId: loginPayload.agencyId,
      agencyName: loginPayload.agencyName,
      token: `local.${btoa(JSON.stringify(loginPayload))}`
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Top Institutional Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="leading-none text-left cursor-pointer"
          >
            <span className="text-xl font-black tracking-tight text-amber-500">Disk</span>
            <span className="text-xl font-black tracking-tight text-blue-700 italic">
              Ingressos
            </span>
            <span className="block text-[9px] text-slate-400 font-medium tracking-tight">
              Conectando pessoas a grandes experiências
            </span>
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <img
            src="/assets/logo-vale-color-h.png"
            alt="Vale da Música"
            className="h-6 w-auto object-contain hidden sm:block"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambiente Integrado RBAC • Parque Jaime Lerner</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Banner — Rua da Música / Ópera de Arame */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-md">
          <img
            src="/assets/vale-aerea-dourada.png"
            alt="Rua da Música - Ópera de Arame - Curitiba"
            className="w-full h-56 sm:h-64 object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-2.5">
                <img
                  src="/assets/logo-vale-color-h.png"
                  alt="Vale da Música"
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 border border-white/20 text-blue-300">
                Curitiba • Paraná
              </span>
            </div>

            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 block">
                PORTAL DE GESTÃO E DISTRIBUIÇÃO B2B
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Rua da Música
              </h1>
              <p className="text-xs sm:text-sm text-slate-200">
                Parque Jaime Lerner • Ópera de Arame — Plataforma Oficial integrada ao Core PDT DiskIngressos
              </p>
              <img
                src="/assets/logo-vale-ondas.png"
                alt="Ondas Vale da Música"
                className="h-3.5 w-48 object-contain object-left pt-1 opacity-95"
              />
            </div>
          </div>
        </div>

        {/* VIEW 1: CENTRAL DE ACESSOS (`/`) */}
        {!selectedPortal ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Selecione seu ambiente de acesso
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quatro entradas independentes com controle de sessão e isolamento de permissões sobre a mesma base operacional
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Rotas diretas: /agencia • /operador • /produtor • /admin
              </span>
            </div>

            {/* 4 Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
              {PORTAL_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectPortalCard(card)}
                    className={`bg-white rounded-2xl border border-slate-200 ${card.borderHover} p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer group`}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-11 h-11 rounded-xl ${card.iconBg} text-white flex items-center justify-center shadow-xs`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {card.path}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                          {card.badge}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPortalCard(card);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Entrar</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Matriz de Permissões e Isolamento */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Arquitetura de Permissões & Isolamento por Perfil (RBAC)
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ● Validação Ativa no Servidor (/api/b2b)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Agência (/agencia)</div>
                  <p className="text-[11px] text-slate-600">
                    Somente o portal da própria agência, com isolamento por <code>agencyId</code> e múltiplos usuários próprios.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Operador (/operador)</div>
                  <p className="text-[11px] text-slate-600">
                    Painel operacional do Parque Jaime Lerner, credenciamento de agências, estoque, PDV e catraca.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Produtor (/produtor)</div>
                  <p className="text-[11px] text-slate-600">
                    Painel comercial do evento, equipe de promoters/divulgadores, links, cupons e Ledger de comissões.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Administrador (/admin)</div>
                  <p className="text-[11px] text-slate-600">
                    Acesso global aos três ambientes com seletor superior habilitado para alternar sem sair da sessão.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: LOGIN DO AMBIENTE SELECIONADO (`/agencia`, `/operador`, `/produtor`, `/admin`) */
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${selectedPortal.iconBg} text-white flex items-center justify-center`}
                >
                  <selectedPortal.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    AUTENTICAÇÃO DE AMBIENTE ({selectedPortal.path})
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Acesso — {selectedPortal.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Central de Acessos</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {selectedPortal.role === 'AGENCIA' && (
                <div className="space-y-1.5 bg-blue-50/70 border border-blue-200 rounded-xl p-3.5">
                  <label className="font-bold text-blue-950 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Selecionar Usuário Credenciado da Agência (Multi-Usuário Isolado)</span>
                  </label>
                  <p className="text-[11px] text-blue-800 mb-2">
                    Cada usuário visualiza exclusivamente as reservas, vouchers e cotas da sua própria agência:
                  </p>
                  <select
                    value={selectedAgencyUserId}
                    onChange={(e) => {
                      setSelectedAgencyUserId(e.target.value);
                      const found = agencyUsers.find((u) => u.id === e.target.value);
                      if (found) setEmailInput(found.email);
                    }}
                    className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2.5 font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    {agencyUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.roleTitle}) — {u.agencyName} [{u.agencyId}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  E-mail Corporativo / Credencial
                </label>
                <input
                  type="email"
                  required
                  value={emailInput || getDefaultEmailForRole(selectedPortal.role)}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escopo de Permissão deste Acesso:</span>
                </div>
                {selectedPortal.role === 'AGENCIA' && (
                  <p>
                    Acesso restrito ao <strong>Portal da Agência ({selectedAgencyUser?.agencyName})</strong>. Os menus de Operador e Produtor e os dados de outras agências permanecem bloqueados.
                  </p>
                )}
                {selectedPortal.role === 'OPERADOR' && (
                  <p>
                    Acesso exclusivo ao <strong>Painel Operacional do Parque Jaime Lerner</strong> (Agências, Estoque, Bilheteria, Vouchers e Catraca).
                  </p>
                )}
                {selectedPortal.role === 'PRODUTOR' && (
                  <p>
                    Acesso exclusivo ao <strong>Painel Comercial do Produtor</strong> (Equipe de Vendas, Promoters, Links, Cupons e Comissões).
                  </p>
                )}
                {selectedPortal.role === 'ADMIN' && (
                  <p>
                    <strong>Acesso Administrativo Completo:</strong> libera a navegação integrada entre Agência, Operador e Produtor com seletor rápido no topo.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>
                  {submitting
                    ? 'Autenticando sessão...'
                    : `Entrar em ${selectedPortal.title}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
