import React, { useState } from 'react';
import {
  Megaphone,
  Image,
  Video,
  FileText,
  Download,
  Copy,
  Check,
  Share2,
  QrCode,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  Users,
  Compass,
  CheckCircle2
} from 'lucide-react';
import {
  MARKETING_COLLATERAL_KIT,
  ATTRIBUTION_COMPARISON_DATA
} from '../../data/mockData';

export const MarketingHubTab = () => {
  const [activeSubSection, setActiveSubSection] = useState('assets');
  const [copiedId, setCopiedId] = useState(null);
  const [customUtmAgency, setCustomUtmAgency] = useState('cvc-curitiba');
  const [customUtmCampaign, setCustomUtmCampaign] = useState('primavera-2026');
  const [toastMsg, setToastMsg] = useState(null);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    notify("Texto copiado para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const generatedAffiliateUrl = `https://parquejaimelerner.com.br/ingressos?utm_source=${customUtmAgency}&utm_medium=afiliado_turismo&utm_campaign=${customUtmCampaign}`;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Divulgação & Atribuição de Vendas • Parque Jaime Lerner</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Central de Divulgação & Mídia Kit Oficial
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Forneça materiais aprovados para as agências promoverem o Parque Jaime Lerner. Acompanhe a atribuição inteligente separando <strong>Afiliado Divulgador</strong> (gerou lead no site B2C) de <strong>Agência Compradora B2B</strong>.
          </p>
        </div>

        {/* Section Pill Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubSection('assets')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubSection === 'assets'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mídia Kit & Banners
          </button>
          <button
            onClick={() => setActiveSubSection('utm')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubSection === 'utm'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gerador de Links UTM
          </button>
          <button
            onClick={() => setActiveSubSection('atribuicao')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubSection === 'atribuicao'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Atribuição (Afiliado vs B2B)
          </button>
        </div>
      </div>

      {/* SECTION 1: Mídia Kit & Banners */}
      {activeSubSection === 'assets' && (
        <div className="space-y-6">
          
          {/* Photos Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Image className="w-4 h-4 text-blue-600" />
              <span>Fotos Oficiais em Alta Resolução (Uso Promocional Liberado)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MARKETING_COLLATERAL_KIT.photos.map((ph) => (
                <div key={ph.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group hover:border-blue-400 transition-all">
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img
                      src={ph.url}
                      alt={ph.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                      {ph.category}
                    </div>
                  </div>
                  
                  <div className="p-3.5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{ph.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{ph.dimensions}</span>
                      <span>{ph.size}</span>
                    </div>

                    <button
                      onClick={() => notify(`Download iniciado: ${ph.title}`)}
                      className="w-full py-1.5 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-slate-200 hover:border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Imagem 4K</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos & Texts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Videos (Col-6) */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Vídeos Promocionais & Reels</span>
              </h3>

              <div className="space-y-3">
                {MARKETING_COLLATERAL_KIT.videos.map((vd) => (
                  <div key={vd.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">{vd.title}</h4>
                      <p className="text-[11px] text-slate-500">{vd.format} • Duração {vd.duration}</p>
                    </div>

                    <button
                      onClick={() => notify(`Download de vídeo iniciado: ${vd.title}`)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 flex items-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Copies (Col-6) */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Textos & Copies Aprovados (WhatsApp / Redes)</span>
              </h3>

              <div className="space-y-3">
                {MARKETING_COLLATERAL_KIT.campaignCopies.map((cp) => (
                  <div key={cp.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cp.target}
                      </span>
                      <button
                        onClick={() => handleCopyText(cp.id, cp.text)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        {copiedId === cp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Texto</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{cp.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 2: Gerador de Links UTM */}
      {activeSubSection === 'utm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-600" />
              <span>Gerador de Links Rastreáveis com Parâmetros UTM</span>
            </h3>
            <p className="text-xs text-slate-500">
              Gere links personalizados para as agências divulgarem no Instagram, WhatsApp ou campanhas de e-mail. Todas as compras originadas através deste link serão atribuídas automaticamente à agência.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Identificador da Agência (utm_source):</label>
              <input
                type="text"
                value={customUtmAgency}
                onChange={(e) => setCustomUtmAgency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Campanha (utm_campaign):</label>
              <input
                type="text"
                value={customUtmCampaign}
                onChange={(e) => setCustomUtmCampaign(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Generated URL Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="overflow-hidden">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                Link Rastreável Gerado:
              </span>
              <p className="font-mono text-xs text-emerald-400 truncate mt-0.5">
                {generatedAffiliateUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyText('url-gen', generatedAffiliateUrl)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Atribuição (Afiliado vs Agência B2B) */}
      {activeSubSection === 'atribuicao' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Regra de Atribuição Dupla de Canais</span>
            </h4>
            <p>
              • <strong>Afiliado Divulgador:</strong> A agência ou influencer atrai o visitante pela web. A compra é concluída pelo cliente final na página oficial do parque. O sistema registra a UTM e comissiona a divulgação.<br />
              • <strong>Agência Compradora B2B:</strong> A agência compra em atacado com cota reservada, emite vouchers próprios e revende no pacote turístico.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Código & Data</th>
                  <th className="py-3 px-4">Canal / Modelo</th>
                  <th className="py-3 px-4">Divulgador / Agência</th>
                  <th className="py-3 px-4">Ação Registrada</th>
                  <th className="py-3 px-4">Qtd. Ingressos</th>
                  <th className="py-3 px-4">Total Pedido</th>
                  <th className="py-3 px-4">Comissão</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ATTRIBUTION_COMPARISON_DATA.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{item.id}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.channelType === 'AFILIADO_DIVULGACAO'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.channelType === 'AFILIADO_DIVULGACAO' ? 'Afiliado (Divulgação B2C)' : 'Agência B2B Direta'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {item.actorName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.action}
                      <p className="text-[10px] text-slate-400">{item.transactionChannel}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.ticketQty}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      R$ {item.orderTotal.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      R$ {item.commissionAmount.toFixed(2)} ({item.commissionPct}%)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
