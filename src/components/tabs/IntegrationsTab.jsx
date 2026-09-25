import React, { useState } from 'react';
import {
  Code,
  Key,
  Webhook,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Terminal,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { B2B_API_ENDPOINTS, WEBHOOKS_LOG_DATA } from '../../data/mockData';

export const IntegrationsTab = () => {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [sandboxMode, setSandboxMode] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://erp.agenciaturismo.com.br/webhooks/parquejaimelerner');
  const [selectedEventToSimulate, setSelectedEventToSimulate] = useState('reserva.confirmada');
  const [webhookLogs, setWebhookLogs] = useState(WEBHOOKS_LOG_DATA);
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyApiKey = () => {
    const key = sandboxMode
      ? 'rm_test_9921_turismobrasil_sandbox_token_2026'
      : 'rm_live_8412_turismobrasil_production_key_2026';
    navigator.clipboard?.writeText(key);
    setCopiedKey(true);
    notify("Chave de API copiada!");
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSimulateWebhook = () => {
    const newLog = {
      id: `wh-${Date.now().toString().slice(-4)}`,
      event: selectedEventToSimulate,
      timestamp: new Date().toLocaleString('pt-BR'),
      agency: "Agência Turismo Brasil (ERP)",
      payload: {
        event: selectedEventToSimulate,
        idempotencyKey: `idemp-${Date.now()}`,
        data: {
          reservationId: "RES-B2B-1090",
          status: selectedEventToSimulate.includes('confirmada') ? 'CONFIRMED' : 'PROCESSED',
          timestamp: new Date().toISOString()
        }
      },
      status: 200,
      response: "200 OK (Dispatched via Parque Jaime Lerner API)"
    };

    setWebhookLogs(prev => [newLog, ...prev]);
    notify(`Evento Webhook "${selectedEventToSimulate}" disparado com sucesso para ${webhookUrl}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Code className="w-4 h-4" />
            <span>API Comercial B2B & Webhooks • Integração Direta de ERPs</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Integrações & Webhooks para Grandes Agências
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Permite que operadoras e redes nacionais (CVC, Flytour, Monde, Totvs) integrem seus sistemas diretamente com a API do Parque Jaime Lerner para cotação, reserva com holding temporário, emissão de vouchers e notificações assíncronas.
          </p>
        </div>

        {/* Environment Selector: Sandbox vs Produção */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-2">Ambiente:</span>
          <button
            onClick={() => setSandboxMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sandboxMode ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧪 Sandbox (Homologação)
          </button>
          <button
            onClick={() => setSandboxMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !sandboxMode ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Produção (Live)
          </button>
        </div>
      </div>

      {/* API Key Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Credenciais da API ({sandboxMode ? 'Modo Sandbox' : 'Modo Produção'}):
            </span>
          </div>
          <p className="font-mono text-xs text-amber-300">
            {sandboxMode
              ? 'dk_test_9921_turismobrasil_sandbox_token_2026'
              : 'dk_live_8412_turismobrasil_production_key_2026'}
          </p>
          <span className="text-[10px] text-slate-400 block">
            {sandboxMode
              ? 'Use para simulação de reservas e testes sem cobrança real no financeiro.'
              : 'Chave restrita com débito em conta de crédito faturado.'}
          </span>
        </div>

        <button
          onClick={handleCopyApiKey}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700 shrink-0"
        >
          {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedKey ? 'Copiado!' : 'Copiar Token'}</span>
        </button>
      </div>

      {/* Tabs: Endpoints vs Webhooks Simulator */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'endpoints' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Documentação de Endpoints REST (6 Métodos)
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'webhooks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Simulador & Logs de Webhooks em Tempo Real
        </button>
      </div>

      {/* TAB 1: REST Endpoints */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {B2B_API_ENDPOINTS.map((ep, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                  ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">{ep.path}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{ep.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{ep.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Webhooks Simulator */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          
          {/* Simulator Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Webhook className="w-4 h-4 text-blue-600" />
              <span>Simulador de Disparo de Webhook para o ERP da Agência</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">URL de Destino do Webhook:</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Evento a Disparar:</label>
                <select
                  value={selectedEventToSimulate}
                  onChange={(e) => setSelectedEventToSimulate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="reserva.confirmada">reserva.confirmada</option>
                  <option value="pedido.pago">pedido.pago</option>
                  <option value="ingresso.emitido">ingresso.emitido</option>
                  <option value="reserva.expirada">reserva.expirada</option>
                  <option value="pedido.cancelado">pedido.cancelado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSimulateWebhook}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disparar Evento de Teste</span>
              </button>
            </div>
          </div>

          {/* Webhook Log History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-800">Histórico de Entregas de Webhooks</span>
              <span className="text-[11px] text-slate-400">Tempo real</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-mono">
              {webhookLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {log.event}
                      </span>
                      <span className="font-bold text-slate-800 font-sans">{log.agency}</span>
                    </div>
                    <div className="flex items-center gap-2 font-sans text-[11px]">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status} OK
                      </span>
                    </div>
                  </div>

                  <pre className="text-[11px] bg-slate-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto mt-2">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
