import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  KeyRound,
  UserCheck
} from 'lucide-react';

const PROFILES = [
  {
    id: 'agency',
    path: '/agencia',
    aliases: ['agency', 'agencia'],
    name: 'Agência',
    desc: 'Reservas, excursões, vouchers e cotas',
    badge: 'Portal Exclusivo por Agência',
    icon: Briefcase,
    iconBg: 'bg-blue-600',
    accounts: [
      {
        label: 'Roberto Almeida — Agência Turismo Brasil (AG-006 • Equipe A)',
        email: 'roberto@turismobrasil.com.br',
        pass: 'AgenciaBrasil@2026'
      },
      {
        label: 'Carla Mendes — Agência Turismo Brasil (AG-006 • Equipe A)',
        email: 'carla@turismobrasil.com.br',
        pass: 'AgenciaBrasil@2026'
      },
      {
        label: 'Carlos Eduardo — Mundo Brasil Turismo (AG-001 • Equipe B)',
        email: 'carlos@mundobrasilturismo.com.br',
        pass: 'MundoBrasil@2026'
      },
      {
        label: 'Helena Toledo — Mundo Brasil Turismo (AG-001 • Equipe B)',
        email: 'helena@mundobrasilturismo.com.br',
        pass: 'MundoBrasil@2026'
      },
      {
        label: 'Fernanda Lima — Viva Viagens (AG-002 • Equipe C)',
        email: 'fernanda@vivaviagens.com.br',
        pass: 'VivaViagens@2026'
      }
    ]
  },
  {
    id: 'operator',
    path: '/operador',
    aliases: ['operator', 'operador'],
    name: 'Operador',
    desc: 'Agências, ingressos, estoque e check-in',
    badge: 'Parque Jaime Lerner',
    icon: Building2,
    iconBg: 'bg-emerald-600',
    accounts: [
      {
        label: 'Operador Parque Jaime Lerner (Catraca & Estoque)',
        email: 'operador@parquejaimelerner.com.br',
        pass: 'ParqueLerner@2026'
      }
    ]
  },
  {
    id: 'producer',
    path: '/produtor',
    aliases: ['producer', 'produtor'],
    name: 'Produtor',
    desc: 'Equipe comercial, vendas e comissões',
    badge: 'Gestão Comercial & Ledger',
    icon: Users,
    iconBg: 'bg-purple-600',
    accounts: [
      {
        label: 'Vinicius Produtor Comercial (Equipe de Vendas)',
        email: 'produtor@valedamusica.com.br',
        pass: 'ProdutorVale@2026'
      }
    ]
  },
  {
    id: 'admin',
    path: '/admin',
    aliases: ['admin', 'administrador'],
    name: 'Administrador',
    desc: 'Acesso completo aos três ambientes e gestão de usuários',
    badge: 'Visão Global Multi-Ambiente',
    icon: ShieldCheck,
    iconBg: 'bg-slate-900',
    accounts: [
      {
        label: 'Administrador Geral PDT (3 Ambientes + Cadastro de Usuários)',
        email: 'admin@valedamusica.com.br',
        pass: 'ValeDaMusica@2026'
      }
    ]
  }
];

function resolveSlug(pathname) {
  const seg = (pathname || '/').split('/')[1]?.toLowerCase() || '';
  const found = PROFILES.find((p) => p.aliases.includes(seg));
  return found ? found.id : '';
}

export function AccessGate({ onLogin }) {
  const [selected, setSelected] = useState(() => resolveSlug(window.location.pathname));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const current = PROFILES.find((p) => p.id === selected) || null;

  useEffect(() => {
    const onPop = () => setSelected(resolveSlug(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (current && current.accounts?.length > 0 && !email) {
      setEmail(current.accounts[0].email);
      setPassword(current.accounts[0].pass);
    }
  }, [current, email]);

  const handleSelectProfile = (p) => {
    setError('');
    setSelected(p.id);
    if (p.accounts?.[0]) {
      setEmail(p.accounts[0].email);
      setPassword(p.accounts[0].pass);
    }
    window.history.pushState({}, '', p.path);
  };

  const handleBackToHub = () => {
    setSelected('');
    setEmail('');
    setPassword('');
    setError('');
    window.history.pushState({}, '', '/');
  };

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no login');
      if (data.user.role !== selected && data.user.role !== 'admin') {
        throw new Error('Sua conta não tem permissão para acessar este ambiente');
      }
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBackToHub}
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
          <span>Autenticação Scrypt + HMAC • Neon PostgreSQL</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Visual — Rua da Música / Parque Jaime Lerner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-md">
          <img
            src="/assets/vale-aerea-dourada.png"
            alt="Rua da Música - Ópera de Arame - Curitiba"
            className="w-full h-52 sm:h-60 object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center">
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

            <div className="space-y-1 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 block">
                PORTAL DE GESTÃO E DISTRIBUIÇÃO B2B
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Rua da Música
              </h1>
              <p className="text-xs sm:text-sm text-slate-200">
                Parque Jaime Lerner • Ópera de Arame — Central Integrada de Acessos e Permissões
              </p>
              <img
                src="/assets/logo-vale-ondas.png"
                alt="Ondas Vale da Música"
                className="h-3.5 w-48 object-contain object-left pt-1 opacity-95"
              />
            </div>
          </div>
        </div>

        {/* TELA 1: CENTRAL DE ACESSOS (`/`) */}
        {!current ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Selecione seu ambiente de acesso
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cada perfil possui login individual e escopo de permissões validado no servidor
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
              {PROFILES.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer group"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-11 h-11 rounded-xl ${p.iconBg} text-white flex items-center justify-center shadow-xs`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {p.path}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                          {p.badge}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{p.name}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProfile(p);
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
          </div>
        ) : (
          /* TELA 2: LOGIN INDIVIDUAL DO AMBIENTE (`/agencia`, `/operador`, `/produtor`, `/admin`) */
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${current.iconBg} text-white flex items-center justify-center`}
                >
                  <current.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    LOGIN INDIVIDUAL ({current.path})
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Entrar como {current.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToHub}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Escolher outro ambiente</span>
              </button>
            </div>

            {/* Seletor rápido de contas migradas no Neon para teste de isolamento */}
            {current.accounts?.length > 0 && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                <label className="font-bold text-blue-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>
                    {current.id === 'agency'
                      ? 'Selecionar Funcionário / Agência (Teste Multi-Agência no Neon)'
                      : 'Conta Configurada no Banco Neon'}
                  </span>
                </label>
                <select
                  value={email}
                  onChange={(e) => {
                    const acc = current.accounts.find((a) => a.email === e.target.value);
                    if (acc) {
                      setEmail(acc.email);
                      setPassword(acc.pass);
                    }
                  }}
                  className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  {current.accounts.map((acc) => (
                    <option key={acc.email} value={acc.email}>
                      {acc.label} ({acc.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={login} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Senha</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-3 font-bold text-xs disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {busy ? 'Validando credenciais no Neon...' : 'Acessar ambiente'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
