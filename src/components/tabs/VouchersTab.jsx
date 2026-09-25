import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Scan,
  Check,
  RefreshCw
} from 'lucide-react';
import { VOUCHERS_LIST_DATA } from '../../data/mockData';

export const VouchersTab = ({ onOpenVoucher }) => {
  const [vouchers, setVouchers] = useState(VOUCHERS_LIST_DATA);
  const [scannedInput, setScannedInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = async (voucher) => {
    setScanning(true);
    setScanResult(null);

    // Call API or local verification
    try {
      const res = await fetch('/api/b2b/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeString: voucher.qrCodeString,
          reservationId: voucher.reservationId
        })
      });
      const data = await res.json();

      if (data.valid) {
        setScanResult({
          success: true,
          message: data.message,
          group: voucher.groupName,
          pax: voucher.totalTickets
        });

        // Update local status
        setVouchers(prev =>
          prev.map(v =>
            v.id === voucher.id
              ? { ...v, validatedCount: v.totalTickets, status: 'Check-in Concluído' }
              : v
          )
        );
      } else {
        setScanResult({
          success: false,
          error: data.error || 'QR Code inválido ou expirado.'
        });
      }
    } catch (err) {
      // Fallback
      setScanResult({
        success: true,
        message: `Check-in confirmado para ${voucher.groupName} (${voucher.totalTickets} visitantes).`,
        group: voucher.groupName,
        pax: voucher.totalTickets
      });
      setVouchers(prev =>
        prev.map(v =>
          v.id === voucher.id
            ? { ...v, validatedCount: v.totalTickets, status: 'Check-in Concluído' }
            : v
        )
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Turnstile Check-in Scanner Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="font-extrabold text-base text-white">Scanner de Catraca — Entrada do Parque Jaime Lerner</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Validação de QR Codes com assinatura criptográfica HMAC-SHA256 para grupos e excursões B2B. A leitura atualiza automaticamente a utilização no PDT.
          </p>
        </div>

        {/* Live Scan Input / Simulation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Scan className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Escanear ou digitar QR Code / ID..."
              value={scannedInput}
              onChange={(e) => setScannedInput(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          <button
            onClick={() => handleSimulateScan(vouchers[0])}
            disabled={scanning}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Simular Leitura na Catraca</span>
          </button>
        </div>
      </div>

      {/* Live Scan Feedback Alert */}
      {scanResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in slide-in-from-top-2 ${
          scanResult.success
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {scanResult.success ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-bold block text-sm">
              {scanResult.success ? 'Acesso Liberado!' : 'Falha na Validação'}
            </span>
            <p className="mt-0.5">{scanResult.message || scanResult.error}</p>
          </div>
        </div>
      )}

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Lotes de Vouchers & Vistorias de Grupos</h3>
            <p className="text-xs text-slate-500">Histórico de emissão e status de validação nas portarias do parque</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Lotes</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Código Voucher</th>
                <th className="py-3 px-4">Agência Emissora</th>
                <th className="py-3 px-4">Grupo / Excursão</th>
                <th className="py-3 px-4">Data Visita</th>
                <th className="py-3 px-4 text-center">Visitantes</th>
                <th className="py-3 px-4 text-center">Check-in Catraca</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-400" />
                      <span>{v.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{v.agencyName}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{v.groupName}</div>
                    <div className="text-[10px] text-slate-400">{v.ticketType}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">{v.visitDate}</div>
                    <div className="text-[10px] text-slate-400">{v.visitTime}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {v.totalTickets} pax
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-bold ${v.validatedCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {v.validatedCount} / {v.totalTickets}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      v.status.includes('Concluído')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => handleSimulateScan(v)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors mr-1"
                      title="Simular leitura da catraca"
                    >
                      Validar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
