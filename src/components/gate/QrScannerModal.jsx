import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  QrCode,
  Volume2,
  VolumeX,
  Flashlight,
  RefreshCw,
  Building2,
  Users
} from 'lucide-react';
import { REAL_TIME_GATE_ACCESS_LOGS, BOOKINGS_LIST } from '../../data/mockData';

export const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanResult, setScanResult] = useState(null); // { status: 'AUTHORIZED' | 'DENIED', data: ... }
  const [simulating, setSimulating] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Play audio beep (Web Audio API)
  const playBeep = (isSuccess) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador não possui suporte à câmera ou conexão não é segura (HTTPS/localhost).');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('[Camera Scanner]:', err.message);
      setCameraError(err.message || 'Câmera não autorizada ou indisponível.');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScanResult(null);
    }
    return () => stopCamera();
  }, [isOpen]);

  // Handle Scan Verification
  const processScanCode = (codeString, sampleBooking = null) => {
    setSimulating(true);

    setTimeout(() => {
      setSimulating(false);

      // Check if valid
      const isValid = !codeString.includes('INVALID') && !codeString.includes('RECUSADO');

      if (isValid) {
        playBeep(true);
        const booking = sampleBooking || BOOKINGS_LIST[0];
        const newLog = {
          id: `acc-${Date.now()}`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('pt-BR'),
          ticketId: `ING-${Math.floor(10000 + Math.random() * 90000)}`,
          orderId: booking.id,
          qrCode: codeString.slice(-8),
          agencyName: booking.agencyName || 'Agência Turismo Brasil',
          product: booking.items?.[0]?.ticketName || 'Entrada Geral Parque',
          gate: 'Catraca 02 - Excursões & Grupos',
          status: 'Autorizado',
          attendeeName: booking.groupName || 'Grupo Cadastrado'
        };

        setScanResult({
          status: 'AUTHORIZED',
          log: newLog,
          booking
        });

        onScanSuccess && onScanSuccess(newLog);
      } else {
        playBeep(false);
        setScanResult({
          status: 'DENIED',
          reason: 'QR Code expirado ou já utilizado às 09:15 na Catraca 01.',
          code: codeString
        });
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white leading-tight">
                Leitor de QR Code • Catraca Física
              </h3>
              <p className="text-[11px] text-slate-400">
                Catraca 02 - Desembarque de Excursões & Grupos B2B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? 'Silenciar bip da catraca' : 'Ativar som de bip'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport / Camera Body */}
        <div className="p-6 space-y-4">
          
          {/* Result Banner Overlay if Scanned */}
          {scanResult ? (
            <div className={`rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 ${
              scanResult.status === 'AUTHORIZED'
                ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border border-emerald-500/50 shadow-emerald-500/10 shadow-lg'
                : 'bg-gradient-to-b from-rose-950 to-slate-900 border border-rose-500/50 shadow-rose-500/10 shadow-lg'
            }`}>
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                scanResult.status === 'AUTHORIZED' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {scanResult.status === 'AUTHORIZED' ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>

              <div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${
                  scanResult.status === 'AUTHORIZED' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {scanResult.status === 'AUTHORIZED' ? 'ACESSO AUTORIZADO • CATRACA LIBERADA' : 'ACESSO RECUSADO • CATRACA BLOQUEADA'}
                </span>
                <h4 className="text-xl font-black text-white mt-1">
                  {scanResult.status === 'AUTHORIZED' ? scanResult.booking?.groupName : 'Ingresso Inválido'}
                </h4>
              </div>

              {scanResult.status === 'AUTHORIZED' ? (
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-xs text-left space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Agência:</span>
                    <strong className="text-white">{scanResult.booking?.agencyName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Liberado:</span>
                    <strong className="text-emerald-400">{scanResult.booking?.ticketsCount} Visitantes (Voucher Master)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assinatura HMAC:</span>
                    <code className="text-blue-300 font-mono text-[10px]">VÁLIDA (SHA-256)</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horário Registro:</span>
                    <span className="text-white font-mono">{scanResult.log?.time}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/60 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-200">
                  {scanResult.reason}
                </div>
              )}

              <button
                onClick={() => setScanResult(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Bipar Próximo Ingresso / Voucher</span>
              </button>
            </div>
          ) : (
            <>
              {/* Camera Scanner Viewport */}
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Laser Overlay and Reticle */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-blue-500/60 rounded-2xl relative flex items-center justify-center">
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

                    {/* Animated Scanning Laser Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-[bounce_2s_infinite]" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 mt-3 drop-shadow bg-slate-950/70 px-2 py-0.5 rounded">
                    Aponte para o QR Code do Voucher
                  </span>
                </div>

                {/* Camera error or not active notice */}
                {(!cameraActive || cameraError) && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Modo Scanner Virtual Ativo
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                      {cameraError || 'Acesso à câmera indisponível ou emulador. Utilize os atalhos de teste abaixo para validar os vouchers cadastrados.'}
                    </p>
                  </div>
                )}

                {/* Scanning indicator */}
                {simulating && (
                  <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-xs flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <RefreshCw className="w-8 h-8 text-cyan-300 animate-spin mx-auto" />
                      <span className="text-xs font-bold text-white">Validando assinatura HMAC-SHA256...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Test Bar (Simulate Scans of Real Vouchers) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Testar Vouchers do Banco de Dados:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => processScanCode('RM.B2B.MASTER.GRP101.99281a', BOOKINGS_LIST[0])}
                    disabled={simulating}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left text-xs transition-all hover:border-blue-500 cursor-pointer flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="truncate">
                      <span className="font-bold text-white block truncate">Excursão Positivo (45 pax)</span>
                      <span className="font-mono text-[10px] text-blue-300">RM.B2B.RES1089</span>
                    </div>
                  </button>

                  <button
                    onClick={() => processScanCode('RM.B2B.MASTER.GRP102.7711ab', BOOKINGS_LIST[1])}
                    disabled={simulating}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left text-xs transition-all hover:border-blue-500 cursor-pointer flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="truncate">
                      <span className="font-bold text-white block truncate">Melhor Idade SP (32 pax)</span>
                      <span className="font-mono text-[10px] text-blue-300">RM.B2B.RES1088</span>
                    </div>
                  </button>

                  <button
                    onClick={() => processScanCode('RM.B2B.RECUSADO.INVALID.000', null)}
                    disabled={simulating}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left text-xs transition-all hover:border-rose-500 cursor-pointer flex items-center gap-2 sm:col-span-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div className="truncate">
                      <span className="font-bold text-rose-300 block">Simular Voucher Falso / Já Utilizado</span>
                      <span className="font-mono text-[10px] text-slate-400">Recusa imediata na catraca com bloqueio</span>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Validação Criptográfica Core DiskIngressos</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
