import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles
} from 'lucide-react';

export const PRESET_USERS = [
  {
    id: 'usr-operator',
    name: 'Parque Jaime Lerner',
    role: 'Administrador Geral',
    email: 'operacoes@parquejaimelerner.curitiba.br',
    view: 'operator',
    badge: 'Operador Oficial',
    initials: 'PL',
    bg: 'bg-[#0252b4]',
    description: 'Gestão de cotas de inventário, homologação de agências, regras de 6% e catracas.'
  },
  {
    id: 'usr-agency',
    name: 'Agência Turismo Brasil',
    role: 'Agente Credenciado',
    email: 'reservas@turismobrasil.com.br',
    view: 'agency',
    badge: 'Agência Parceira',
    initials: 'AT',
    bg: 'bg-emerald-600',
    description: 'Emissão de reservas, caravanas e excursões escolares com voucher master.'
  },
  {
    id: 'usr-promoter',
    name: 'João Silva',
    role: 'Promoter & Divulgador',
    email: 'joao.silva@promoter.curitiba.br',
    view: 'promoter',
    badge: 'Equipe de Vendas',
    initials: 'JS',
    bg: 'bg-purple-600',
    description: 'Links rastreáveis com parâmetros UTM, metas de conversão e comissão.'
  }
];

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('presets'); // 'presets' | 'form'

  if (!isOpen) return null;

  const handleSelectPreset = (user) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const sessionData = {
        ...user,
        token: `jwt_b2b_token_${Date.now()}`,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem('b2b_session_user', JSON.stringify(sessionData));
      onLoginSuccess && onLoginSuccess(sessionData);
      onClose();
    }, 400);
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const matched = PRESET_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        role: 'Usuário B2B',
        email,
        view: 'agency',
        badge: 'Agência Credenciada',
        initials: email.substring(0, 2).toUpperCase(),
        bg: 'bg-blue-600'
      };

      const sessionData = {
        ...matched,
        token: `jwt_b2b_token_${Date.now()}`,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem('b2b_session_user', JSON.stringify(sessionData));
      onLoginSuccess && onLoginSuccess(sessionData);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Brand Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              RM
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
                PARQUE JAIME LERNER • RUA DA MÚSICA
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Plataforma de Distribuição Turística B2B
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
            Selecione um perfil de demonstração ou faça login com suas credenciais oficiais do Core Transacional.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-5 bg-white/10 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveProfileTab('presets')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeProfileTab === 'presets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Acesso Rápido por Perfil (1 Clique)</span>
            </button>
            <button
              onClick={() => setActiveProfileTab('form')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeProfileTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail & Senha</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeProfileTab === 'presets' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Escolha o Perfil Desejado para Navegação:
              </span>

              {PRESET_USERS.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => handleSelectPreset(usr)}
                  disabled={submitting}
                  className="w-full p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group flex items-center justify-between gap-4 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs ${usr.bg}`}>
                      {usr.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                          {usr.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {usr.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{usr.email}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{usr.description}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: operacoes@parquejaimelerner.curitiba.br"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Senha de Acesso</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                  <span>Manter sessão ativa neste dispositivo</span>
                </label>
                <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert("Instruções de recuperação enviadas ao e-mail cadastrado."); }} className="text-blue-600 font-bold hover:underline">
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Audit Notice */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Autenticação protegida com criptografia ponta a ponta</span>
          </div>
          <span className="font-mono text-slate-400">Core Transacional v2.0</span>
        </div>

      </div>
    </div>
  );
};
