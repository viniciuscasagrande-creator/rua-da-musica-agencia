import React, { useState, useEffect } from 'react';
import { AgencySidebar } from './AgencySidebar';
import { BookingWizard } from './BookingWizard';
import {
  Leaf,
  Music,
  Camera,
  Users,
  Calendar,
  QrCode,
  DollarSign,
  Download,
  Building,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Code,
  Key,
  Copy,
  Check,
  Upload,
  Bus,
  Plus,
  ArrowRight
} from 'lucide-react';
import { OPERATOR_INFO, BOOKINGS_LIST, GROUP_RESERVATIONS_WITH_MANIFEST } from '../../data/mockData';

export const AgencyPortal = ({ onOpenVoucher }) => {
  const [activeTab, setActiveTab] = useState('comprar');
  const [wizardKey, setWizardKey] = useState(0);
  const [bookings, setBookings] = useState(
    BOOKINGS_LIST.filter(b => b.agencyName.includes('Turismo Brasil'))
  );
  const [toastMessage, setToastMessage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartNewBooking = () => {
    setWizardKey(prev => prev + 1);
    setActiveTab('comprar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast("Formulário de Nova Reserva B2B carregado com sucesso.");
  };

  const handleDownloadMedia = (title, filename, size) => {
    const content = `Kit Promocional B2B - Parque Jaime Lerner\nMaterial: ${title}\nTamanho Estimado: ${size}\nData do Download: ${new Date().toLocaleString('pt-BR')}\n\nTermos de Uso:\nMaterial promocional liberado exclusivamente para a agência parceira comercializar e divulgar passeios e ingressos do Parque Jaime Lerner.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Download concluído: ${title} (${size})`);
  };

  const handleDownloadManifestTemplate = () => {
    const csvContent = "Nome Completo,Documento (RG/CPF),Data de Nascimento,Tipo Ingresso,Telefone Contato,Responsavel Menor\n" +
      "João Carlos da Silva,12.345.678-9,15/04/1985,Inteira,(41) 99888-1122,\n" +
      "Maria Eduarda Santos,23.456.789-0,20/08/1992,Inteira,(41) 99777-2233,\n" +
      "Lucas Gabriel Souza,34.567.890-1,10/12/2012,Meia-Entrada,(41) 99666-3344,João Carlos da Silva\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "modelo_manifesto_passageiros_jaime_lerner.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Modelo de planilha baixado (.csv)!");
  };

  const handleProcessSpreadsheet = (e) => {
    e.preventDefault();
    if (!uploadFileName) {
      showToast("Por favor, selecione uma planilha para continuar.");
      return;
    }
    setIsProcessingFile(true);
    setTimeout(() => {
      setIsProcessingFile(false);
      setShowUploadModal(false);
      setUploadFileName('');
      showToast("Planilha processada com sucesso! 32 passageiros vinculados ao Voucher Master.");
    }, 1200);
  };

  useEffect(() => {
    fetch('/api/b2b/reservations?agencyId=ag-06')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setBookings(res.data);
        }
      })
      .catch(err => console.warn('[B2B] Could not fetch reservations from API:', err));
  }, []);

  const handleBookingCreated = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row bg-[#f8fafc]">
      
      {/* Agency Left Sidebar */}
      <AgencySidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'comprar') {
            handleStartNewBooking();
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Agency Content Area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Top Attraction Panoramic Banner (Exact replica of 11_30_25) */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 group">
          <img
            src="/assets/parque-banner.jpg"
            alt="Parque Jaime Lerner - Curitiba"
            className="w-full h-44 sm:h-52 object-cover group-hover:scale-[1.02] transition-transform duration-700"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

          {/* Banner Contents */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                  ATRAÇÃO CULTURAL & PARQUE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Parque Jaime Lerner
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Rua da Música - Curitiba - PR
                </p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900/60 backdrop-blur-xs border border-white/20 text-slate-100">
                  Cultura, música e experiências inesquecíveis
                </div>
              </div>

              {/* Tag Highlights on Top Right */}
              <div className="hidden lg:grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-slate-900/50 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 self-start">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Natureza e lazer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-200">Música e cultura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200">Arquitetura icônica</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-200">Ideal para grupos e excursões</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Ambiente de demonstração: reservas e vouchers exibidos aqui ainda não autorizam venda ou entrada no parque.
        </p>
        {activeTab === 'comprar' && (
          <BookingWizard key={wizardKey} onBookingCreated={handleBookingCreated} />
        )}

        {activeTab === 'vouchers' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900">Meus Vouchers B2B</h3>
                <p className="text-xs text-slate-500">Consulte os vouchers associados às reservas da agência com QR Code e assinatura criptográfica.</p>
              </div>
              <button
                onClick={handleStartNewBooking}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Reserva</span>
              </button>
            </div>
            {bookings.filter(b => b.qrCode && b.status !== 'Cancelado').length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum voucher disponível.</p>
            ) : bookings.filter(b => b.qrCode && b.status !== 'Cancelado').map(b => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 rounded-xl p-4">
                <div><p className="font-semibold text-sm text-slate-900">{b.groupName}</p><p className="text-xs text-slate-500">{b.id} · {b.visitDate} · {b.ticketsCount} ingressos</p></div>
                <button onClick={() => onOpenVoucher?.(b)} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer">Visualizar voucher de demonstração</button>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'grupos' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Grupos, Excursões & Manifesto Nominal</h3>
                <p className="text-xs text-slate-500">Cadastre caravanas e excursões, envie listas de passageiros e emita o Voucher Master unificado para o ônibus inteiro.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enviar Planilha de Passageiros</span>
                </button>
                <button
                  onClick={handleStartNewBooking}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nova Excursão</span>
                </button>
              </div>
            </div>

            {GROUP_RESERVATIONS_WITH_MANIFEST.map(grp => (
              <div key={grp.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                      {grp.bookingCode}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-1">{grp.groupName}</h4>
                    <p className="text-xs text-slate-500">
                      Data: <strong>{grp.visitDate} às {grp.visitTime}</strong> • Responsável: {grp.responsibleName} ({grp.responsiblePhone})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        showToast(`Voucher Master gerado para ${grp.groupName} (${grp.totalPassengers} Pax)!`);
                        onOpenVoucher && onOpenVoucher({
                          id: grp.bookingCode,
                          groupName: grp.groupName,
                          visitDate: grp.visitDate,
                          visitTime: grp.visitTime,
                          ticketsCount: grp.totalPassengers,
                          totalAmount: 960.00,
                          status: 'Confirmado',
                          qrCode: `RM.B2B.${grp.bookingCode}.MASTER`
                        });
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Voucher Master ({grp.totalPassengers} Pax)</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast(`Preparando impressão em lote de ${grp.totalPassengers} ingressos nominais...`);
                        window.print();
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Ingressos Individuais
                    </button>
                  </div>
                </div>

                {/* Passenger list preview */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-700 flex justify-between">
                    <span>Manifesto Nominal ({grp.passengers.length} de {grp.totalPassengers} passageiros validados)</span>
                    <span className="text-emerald-700">✓ Todos aptos para check-in</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {grp.passengers.map(pax => (
                      <div key={pax.id} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{pax.name}</span>
                          <span className="text-slate-400 font-mono text-[11px] ml-2">Doc: {pax.doc}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-[11px]">{pax.seat}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                            {pax.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Tab: Minha API & Webhooks */}
        {activeTab === 'api' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Integração API B2B & Webhooks (Autoatendimento)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conecte seu sistema de vendas ou ERP (Monde, CVC Intranet, Totvs) diretamente com a API do Parque Jaime Lerner.
              </p>
            </div>

            {/* Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase">Token Sandbox (Testes)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Homologação</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value="rm_test_9921_turismobrasil_sandbox_token_2026"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700"
                />
                <span className="text-[10px] text-slate-400 block">Use para simulações e chamadas sem débito financeiro.</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase">Chave de Produção (Live)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Produção</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value="rm_live_8412_turismobrasil_production_key_2026"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700"
                />
                <span className="text-[10px] text-slate-400 block">Chave ativa vinculada ao seu limite de crédito faturado.</span>
              </div>
            </div>

            {/* Webhook Endpoint Config */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Configurar URL de Webhook do seu ERP:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue="https://erp.agenciaturismo.com.br/webhooks/parquejaimelerner"
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
                />
                <button
                  onClick={() => alert("URL de Webhook salva com sucesso! Eventos serão despachados automaticamente.")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Salvar Webhook
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Eventos recebidos: <code>reserva.confirmada</code>, <code>pedido.pago</code>, <code>ingresso.emitido</code>, <code>reserva.expirada</code>.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'dados' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-slate-900">Dados da Agência</h3>
            <p className="text-sm text-slate-800">Agência Turismo Brasil</p>
            <p className="text-xs text-slate-600">Dados de demonstração. O cadastro nacional deverá carregar CNPJ, endereço, contatos e situação de credenciamento da agência autenticada pela API.</p>
          </section>
        )}

        {activeTab === 'ajuda' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-slate-900">Ajuda e Suporte</h3>
            <p className="text-sm text-slate-600">Para dúvidas sobre ingressos, reservas e credenciamento, acesse o canal de atendimento do Parque.</p>
            <button onClick={() => setActiveTab('contato')} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-semibold">Ver contatos</button>
          </section>
        )}

        {/* Tab: Minhas Reservas */}
        {activeTab === 'reservas' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Minhas Reservas B2B</h3>
                <p className="text-xs text-slate-500">Histórico de reservas emitidas pela Agência Turismo Brasil</p>
              </div>
              <button
                type="button"
                onClick={handleStartNewBooking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nova Reserva B2B</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Grupo / Excursão</th>
                    <th className="py-3 px-4">Data & Horário</th>
                    <th className="py-3 px-4 text-center">Ingressos</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.groupName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.visitDate} às {b.visitTime}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{b.ticketsCount} pax</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">R$ {b.totalAmount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenVoucher && onOpenVoucher(b)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold border border-blue-200 flex items-center gap-1.5 mx-auto"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Ver Voucher</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Extrato Financeiro & Cota */}
        {activeTab === 'financeiro' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-900">Extrato Financeiro & Limite de Cota B2B</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Cota de Ingressos do Mês</span>
                <span className="text-2xl font-black text-slate-900">1.200 ingressos</span>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '49%' }} />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">590 utilizados (49%)</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Limite de Faturamento B2B</span>
                <span className="text-2xl font-black text-slate-900">R$ 50.000,00</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">R$ 31.238,00 disponível</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Próximo Vencimento</span>
                <span className="text-2xl font-black text-slate-900">10/10/2026</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Fatura quinzenal automatizada</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Materiais de Divulgação */}
        {activeTab === 'materiais' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Kit de Mídia & Materiais Promocionais</h3>
              <p className="text-xs text-slate-500">Recursos visuais autorizados para promoção de pacotes turísticos do Parque Jaime Lerner</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-200 rounded-xl overflow-hidden group">
                <div className="h-32 bg-slate-100 overflow-hidden relative">
                  <img src="/assets/parque-banner.jpg" alt="Fotos HD" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3 text-xs">
                  <span className="font-bold text-slate-800 block">Fotos Oficiais em Alta Definição (4K)</span>
                  <span className="text-slate-400 text-[11px]">28 imagens • 45 MB</span>
                  <button
                    onClick={() => handleDownloadMedia("Fotos Oficiais em Alta Definição (4K)", "Parque_Jaime_Lerner_Fotos_4K.zip", "45 MB")}
                    className="mt-2 w-full py-1.5 bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Pacote</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden group">
                <div className="h-32 bg-slate-100 overflow-hidden relative">
                  <img src="/assets/parque-sunset.jpg" alt="Folders" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3 text-xs">
                  <span className="font-bold text-slate-800 block">Folders & Folhetos Digitais Editáveis</span>
                  <span className="text-slate-400 text-[11px]">Formatos PDF, PSD e Canva</span>
                  <button
                    onClick={() => handleDownloadMedia("Folders & Folhetos Digitais Editáveis", "Parque_Jaime_Lerner_Folders_Editaveis.zip", "18 MB")}
                    className="mt-2 w-full py-1.5 bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Pacote</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden group">
                <div className="h-32 bg-slate-800 flex items-center justify-center text-white text-center p-3">
                  <div>
                    <Music className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Vídeos Promocionais (Reels/Stories)</span>
                  </div>
                </div>
                <div className="p-3 text-xs">
                  <span className="font-bold text-slate-800 block">Vídeos Curtos para Redes Sociais</span>
                  <span className="text-slate-400 text-[11px]">Formato 9:16 vertical com áudio</span>
                  <button
                    onClick={() => handleDownloadMedia("Vídeos Curtos para Redes Sociais", "Parque_Jaime_Lerner_Videos_9x16.zip", "65 MB")}
                    className="mt-2 w-full py-1.5 bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Pacote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Fale com o Parque */}
        {activeTab === 'contato' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 max-w-xl">
            <h3 className="font-bold text-base text-slate-900">Canal Comercial Exclusivo - Parque Jaime Lerner</h3>
            <p className="text-xs text-slate-500">Atendimento prioritário para agências de turismo e operadoras parceiras</p>

            <div className="space-y-3 text-xs pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">WhatsApp de Operações B2B</span>
                  <span className="text-slate-600">(41) 99233-8800 (Plantão de Grupos)</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">E-mail Comercial B2B</span>
                  <span className="text-slate-600">agencias@parquejaimelerner.curitiba.br</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Modal: Enviar Planilha de Passageiros */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Importar Manifesto de Passageiros</h4>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessSpreadsheet} className="py-4 space-y-4 text-xs">
              <p className="text-slate-600">
                Faça o upload do arquivo Excel (<strong>.xlsx</strong>) ou <strong>.csv</strong> contendo o nome completo, documento e tipo de ingresso de cada participante da excursão.
              </p>

              {/* Download Template Box */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">Planilha Modelo Padrão</span>
                  <span className="text-[11px] text-blue-700">Formato aprovado para importação em lote</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadManifestTemplate}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Modelo</span>
                </button>
              </div>

              {/* Upload Drop Zone / Input */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="manifestFileInput"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="manifestFileInput" className="cursor-pointer block">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 block text-sm">
                    {uploadFileName ? uploadFileName : 'Clique para selecionar o arquivo ou arraste aqui'}
                  </span>
                  <span className="text-slate-400 text-[11px] mt-1 block">
                    {uploadFileName ? 'Arquivo selecionado e pronto para vinculação' : 'Suporta .XLSX, .XLS ou .CSV (até 5MB)'}
                  </span>
                </label>
                {!uploadFileName && (
                  <button
                    type="button"
                    onClick={() => setUploadFileName('excursao_colegio_positivo_set2026.xlsx')}
                    className="mt-3 text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    Usar arquivo de exemplo (32 passageiros)
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingFile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {isProcessingFile ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando lista...</span>
                    </>
                  ) : (
                    <span>Processar e Vincular Ingressos</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
