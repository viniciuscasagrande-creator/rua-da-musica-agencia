import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  X,
  Zap,
  CheckCircle2,
  Building2,
  Lock,
  ArrowRight,
  Smartphone
} from 'lucide-react';

export const PixPaymentModal = ({
  isOpen,
  onClose,
  amount = 1350.00,
  orderInfo = {
    groupName: 'Excursão Colégio Positivo 3º Ano',
    totalTickets: 30,
    reservationCode: 'RES-B2B-8942'
  },
  onPaymentConfirmed
}) => {
  // 15-minute countdown (900 seconds) matching inventory hold TTL
  const [timeLeft, setTimeLeft] = useState(900);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting'); // 'waiting' | 'verifying' | 'confirmed'
  const [webhookSimulated, setWebhookSimulated] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(900);
      setPaymentStatus('waiting');
      setWebhookSimulated(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Official EMV standard mock string
  const cleanAmount = Number(amount || 0).toFixed(2);
  const pixCodePayload = `00020101021226840014br.gov.bcb.pix2562pix.parquejaimelerner.curitiba.br/qr/v2/cob/9c55b6a3818e47009477b2b8942520400005303986540${cleanAmount}5802BR5920PARQUE JAIME LERNER6008CURITIBA62070503RES6304E8A2`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCodePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulateWebhook = () => {
    setPaymentStatus('verifying');
    setWebhookSimulated(true);

    setTimeout(() => {
      setPaymentStatus('confirmed');
      setTimeout(() => {
        onPaymentConfirmed && onPaymentConfirmed();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-300 fill-emerald-300" />
              PIX B2B Instantâneo
            </span>
            <span className="text-xs text-slate-300 font-medium">• Liquidação Direta</span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            Pagamento da Reserva
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {orderInfo.groupName} • {orderInfo.totalTickets} ingressos
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* Amount and Hold Countdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Valor Total com Taxa B2B
              </span>
              <span className="text-2xl font-black text-slate-900">
                R$ {cleanAmount}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-amber-500" />
                Hold Expira em
              </span>
              <span className={`text-base font-black font-mono tracking-wider ${timeLeft < 180 ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}`}>
                {formattedTime}
              </span>
            </div>
          </div>

          {/* QR Code Graphic or Success Animation */}
          {paymentStatus === 'confirmed' ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Pagamento Confirmado pelo BACEN!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Webhook recebido com sucesso. Gerando vouchers oficiais e liberando catracas...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              
              {/* Dynamic Mock QR Matrix */}
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-md relative group">
                <div className="w-48 h-48 bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* Vector QR Matrix Pattern */}
                  <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                    {/* Top-left marker */}
                    <rect x="5" y="5" width="28" height="28" rx="3" />
                    <rect x="9" y="9" width="20" height="20" fill="black" />
                    <rect x="13" y="13" width="12" height="12" rx="2" />

                    {/* Top-right marker */}
                    <rect x="67" y="5" width="28" height="28" rx="3" />
                    <rect x="71" y="9" width="20" height="20" fill="black" />
                    <rect x="75" y="13" width="12" height="12" rx="2" />

                    {/* Bottom-left marker */}
                    <rect x="5" y="67" width="28" height="28" rx="3" />
                    <rect x="9" y="71" width="20" height="20" fill="black" />
                    <rect x="13" y="75" width="12" height="12" rx="2" />

                    {/* Dynamic Data Blocks */}
                    <rect x="38" y="10" width="8" height="8" />
                    <rect x="50" y="10" width="8" height="8" />
                    <rect x="42" y="24" width="16" height="8" />
                    
                    <rect x="10" y="38" width="8" height="16" />
                    <rect x="24" y="42" width="12" height="12" />
                    <rect x="42" y="38" width="16" height="16" />
                    <rect x="64" y="40" width="10" height="8" />
                    <rect x="80" y="38" width="12" height="14" />
                    
                    <rect x="38" y="62" width="8" height="12" />
                    <rect x="52" y="58" width="14" height="8" />
                    <rect x="70" y="60" width="8" height="14" />
                    <rect x="84" y="62" width="8" height="8" />

                    <rect x="38" y="78" width="16" height="14" />
                    <rect x="60" y="80" width="14" height="12" />
                    <rect x="80" y="76" width="12" height="16" />
                  </svg>

                  {/* Center Brand Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-emerald-600 border-2 border-white rounded-xl shadow-lg flex items-center justify-center font-black text-white text-xs">
                      PIX
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Smartphone className="w-3 h-3 text-emerald-600" />
                  Escaneie no App do seu Banco
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-emerald-900">
                  {paymentStatus === 'verifying' ? 'Verificando liquidação com o BACEN...' : 'Aguardando pagamento instantâneo...'}
                </span>
              </div>

              {/* Copy-Paste EMV Code */}
              <div className="w-full text-left space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Código Pix Copia e Cola
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCodePayload}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-100 border border-slate-200 rounded-xl text-slate-600 truncate select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Webhook Simulator Action */}
              <div className="w-full pt-3 border-t border-slate-100">
                <button
                  onClick={handleSimulateWebhook}
                  disabled={paymentStatus === 'verifying'}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {paymentStatus === 'verifying' ? 'Processando Webhook...' : 'Simular Confirmação BACEN (Webhook Automático)'}
                  </span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1">
                  Ambiente Sandbox B2B: simula o evento HTTP POST <code>/api/webhooks/pix</code> disparado pela instituição financeira.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            Certificado SSL B2B 256-bit
          </span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default PixPaymentModal;
