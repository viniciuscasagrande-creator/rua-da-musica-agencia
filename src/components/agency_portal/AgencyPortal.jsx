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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { OPERATOR_INFO, BOOKINGS_LIST } from '../../data/mockData';

const HERO_SLIDES = [
  {
    src: '/assets/vale-aerea-dourada.png',
    title: 'Vista Aérea Oficial — Ópera de Arame & Lago',
    caption: 'Arquitetura icônica em meio à mata nativa com o Palco Flutuante ao centro'
  },
  {
    src: '/assets/vale-palco-flutuante.jpg',
    title: 'Palco Flutuante #VALEDAMÚSICA',
    caption: 'Espetáculos musicais sobre o lago da Ópera de Arame durante toda a programação'
  },
  {
    src: '/assets/vale-musica-ao-vivo.jpg',
    title: 'Música Instrumental ao Vivo',
    caption: 'Apresentações ao vivo no Palco Flutuante para grupos e visitantes'
  },
  {
    src: '/assets/vale-opera-interior.jpg',
    title: 'Interior da Ópera de Arame',
    caption: 'Estrutura tubular histórica e experiência cultural imersiva em Curitiba'
  },
  {
    src: '/assets/vale-bosque-passeio.jpg',
    title: 'Passeio pelo Bosque & Rua da Música',
    caption: 'Caminhada ecológica integrada à arquitetura de vidro e ferro'
  },
  {
    src: '/assets/vale-espetaculo-palco.jpg',
    title: 'Grandes Espetáculos Culturais',
    caption: 'Dança, música e artes cênicas no palco principal da Ópera de Arame'
  },
  {
    src: '/assets/vale-natureza-neon.jpg',
    title: 'Instalação Artística "Natureza"',
    caption: 'Arte contemporânea e cenografia luminosa integradas à floresta nativa'
  },
  {
    src: '/assets/vale-arte-fitas.jpg',
    title: 'Intervenções Artísticas & Cores',
    caption: 'Experiências visuais e apresentações vibrantes para todas as idades'
  },
  {
    src: '/assets/vale-oficina-educativa.jpg',
    title: 'Oficinas Criativas & Turismo Pedagógico',
    caption: 'Roteiros educativos ideais para excursões escolares e grupos culturais'
  },
  {
    src: '/assets/vale-familia-cultura.jpg',
    title: 'Lazer Completo para Famílias e Grupos',
    caption: 'Programação interativa com conforto, segurança e infraestrutura dedicada'
  },
  {
    src: '/assets/vale-oficina-arte.jpg',
    title: 'Arte & Identidade Curitibana',
    caption: 'Oficinas temáticas celebrando o ícone arquitetônico da Ópera de Arame'
  },
  {
    src: '/assets/vale-circo-cultura.jpg',
    title: 'Cultura Viva em Todos os Espaços',
    caption: 'Atrações artísticas distribuídas pelos jardins do Parque Jaime Lerner'
  }
];

export const AgencyPortal = ({ agency, bookings: allBookings, onCreateBooking, onOpenVoucher }) => {
  const [activeTab, setActiveTab] = useState('comprar');
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  const [localBookings, setLocalBookings] = useState(
    []
  );

  const bookings = allBookings
    ? allBookings.filter(b => agency && b.agencyId === agency.id)
    : localBookings;

  const brl = (n) => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const brNum = (n) => Number(n || 0).toLocaleString('pt-BR');

  const activeBookings = bookings.filter((b) => b.status !== 'Cancelado');
  const totalTicketsIssued = activeBookings.reduce((acc, b) => acc + Number(b.ticketsCount || 0), 0);
  const totalB2BAmount = activeBookings.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);
  const totalDiskFee = activeBookings.reduce(
    (acc, b) => acc + Number(b.diskFeeAmount || Number(b.totalAmount || 0) * 0.06),
    0
  );
  const quotaLimit = Number(agency?.quotaLimit || 1200);
  const usedQuota = Math.min(quotaLimit, Number(agency?.ticketsSold || 0));
  const usedQuotaPct = Math.round((usedQuota / quotaLimit) * 100);
  const creditLimit = 50000;
  const availableCredit = Math.max(0, creditLimit - totalB2BAmount);

  const handleBookingCreated = (newBooking) => {
    if (onCreateBooking) {
      onCreateBooking(newBooking);
    } else {
      setLocalBookings(prev => [newBooking, ...prev]);
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row bg-[#f8fafc]">
      
      {/* Agency Left Sidebar */}
      <AgencySidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Agency Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-5 space-y-4 max-w-[1700px] mx-auto w-full">
        
        {/* Card Principal Ampliado — Vitrine Multi-Imagens Sem Corte (Troca a cada 10s) */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-950 text-white">
          {/* Ambient Blurred Background */}
          <img
            src={HERO_SLIDES[heroIndex].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30 pointer-events-none transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/85 to-slate-900/75" />

          <div className="relative z-10 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Coluna Esquerda (Identidade Oficial Vale da Música + Destaques + Controles) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center">
                    <img
                      src="/assets/logo-vale-color-h.png"
                      alt="Vale da Música"
                      className="h-6 sm:h-7 w-auto object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30">
                    ATRAÇÃO CULTURAL & PARQUE
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    Parque Jaime Lerner • Vale da Música
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Ópera de Arame & Rua da Música — Curitiba - PR
                  </p>
                </div>

                <img
                  src="/assets/logo-vale-ondas.png"
                  alt="Ondas sonoras Vale da Música"
                  className="h-4 w-56 object-contain object-left opacity-95"
                />

                {/* Legenda ativa da foto em destaque */}
                <div className="bg-slate-900/90 border border-white/15 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-blue-300 font-bold uppercase tracking-wider">
                    <span>{HERO_SLIDES[heroIndex].title}</span>
                    <span className="font-mono text-slate-400">
                      {String(heroIndex + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {HERO_SLIDES[heroIndex].caption}
                  </p>
                </div>
              </div>

              {/* 4 Destaques + Controles de Navegação */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-900/80 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Natureza e lazer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-slate-200">Palco Flutuante & Música</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-200">Arquitetura icônica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-slate-200">Ideal para grupos e excursões</span>
                  </div>
                </div>

                {/* Barra de Troca Automática (10s) e Setas */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {HERO_SLIDES.map((s, idx) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => setHeroIndex(idx)}
                        title={s.title}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === heroIndex
                            ? 'w-6 bg-blue-400'
                            : 'w-2 bg-white/35 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                      }
                      className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-white/15 text-slate-200 cursor-pointer"
                      title="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                      className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-white/15 text-slate-200 cursor-pointer"
                      title="Próxima foto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Vitrine Multi-Imagens Sem Corte (Foto Principal Inteira + 2 Próximas + Tira de Miniaturas) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch flex-1">
                {/* Imagem Principal em Proporção Original (Sem Corte - object-contain com fundo ambientado) */}
                <div className="sm:col-span-8 relative rounded-xl overflow-hidden border border-white/20 bg-slate-900 min-h-[240px] sm:min-h-[280px] flex items-center justify-center shadow-md">
                  <img
                    src={HERO_SLIDES[heroIndex].src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-105"
                  />
                  <img
                    src={HERO_SLIDES[heroIndex].src}
                    alt={HERO_SLIDES[heroIndex].title}
                    className="relative z-10 w-full h-full max-h-[300px] object-contain p-1 transition-all duration-500"
                  />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15">
                    <span className="text-xs font-bold text-white truncate">
                      {HERO_SLIDES[heroIndex].title}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-300 shrink-0">
                      10s auto
                    </span>
                  </div>
                </div>

                {/* 2 Imagens Secundárias Simultâneas (Próximas da Galeria — Sem Corte) */}
                <div className="sm:col-span-4 grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {[1, 2].map((offset) => {
                    const nextIdx = (heroIndex + offset) % HERO_SLIDES.length;
                    const item = HERO_SLIDES[nextIdx];
                    return (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setHeroIndex(nextIdx)}
                        className="relative rounded-xl overflow-hidden border border-white/15 hover:border-blue-400 bg-slate-900 min-h-[125px] sm:min-h-[134px] flex items-center justify-center group cursor-pointer transition-all"
                      >
                        <img
                          src={item.src}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-40"
                        />
                        <img
                          src={item.src}
                          alt={item.title}
                          className="relative z-10 w-full h-full max-h-[136px] object-contain p-1 group-hover:scale-103 transition-transform"
                        />
                        <div className="absolute bottom-1.5 inset-x-1.5 z-20 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-slate-100 truncate text-left">
                          {item.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tira de Miniaturas com Todas as 12 Imagens Adicionadas */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-1">
                {HERO_SLIDES.map((thumb, idx) => (
                  <button
                    key={thumb.src}
                    type="button"
                    onClick={() => setHeroIndex(idx)}
                    title={thumb.title}
                    className={`relative h-11 rounded-lg overflow-hidden border transition-all cursor-pointer bg-slate-900 ${
                      idx === heroIndex
                        ? 'border-blue-400 ring-2 ring-blue-400/60 scale-105 z-10'
                        : 'border-white/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.title}
                      className="w-full h-full object-contain bg-slate-950"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6 KPI Cards da Agência — Mesmo padrão compacto 128px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 auto-rows-fr">
          {[
            {
              label: 'Reservas da Agência',
              value: brNum(activeBookings.length),
              badge: 'Ativas',
              sub: 'No período',
              color: 'bg-blue-600'
            },
            {
              label: 'Ingressos Emitidos',
              value: brNum(totalTicketsIssued),
              badge: 'Lote B2B',
              sub: 'Excursões',
              color: 'bg-emerald-600'
            },
            {
              label: 'Volume B2B Faturado',
              value: brl(totalB2BAmount),
              badge: 'Faturado',
              sub: 'Agência',
              color: 'bg-purple-600'
            },
            {
              label: 'Cota Mensal Usada',
              value: `${brNum(usedQuota)} / ${brNum(quotaLimit)}`,
              badge: `${usedQuotaPct}% uso`,
              sub: 'Ingressos',
              color: 'bg-amber-500'
            },
            {
              label: 'Crédito Disponível',
              value: brl(availableCredit),
              badge: 'Faturamento 15d',
              sub: 'Limite B2B',
              color: 'bg-teal-600'
            },
            {
              label: 'Ticket Médio / Grupo',
              value: brl(activeBookings.length > 0 ? totalB2BAmount / activeBookings.length : 0),
              badge: 'Tarifário B2B',
              sub: 'Por reserva',
              color: 'bg-rose-600'
            }
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-blue-300 ring-1 ring-blue-100 p-3 shadow-xs flex flex-col justify-between gap-1.5 min-w-0 h-[128px] overflow-hidden"
            >
              <div className="flex items-center gap-2 h-9">
                <div
                  className={`w-7 h-7 rounded-lg ${kpi.color} text-white flex items-center justify-center font-mono font-bold text-xs shrink-0`}
                >
                  0{idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">{kpi.label}</span>
              </div>
              <div className="text-lg font-mono font-bold tabular-nums tracking-tighter text-slate-950 whitespace-nowrap overflow-hidden text-ellipsis">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] h-7">
                <span className="font-bold tabular-nums text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                  {kpi.badge}
                </span>
                <span className="text-slate-600 font-medium truncate text-right">{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Tab Body */}
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Ambiente de demonstração: reservas e vouchers exibidos aqui ainda não autorizam venda ou entrada no parque.
        </p>
        {activeTab === 'comprar' && (
          <BookingWizard
            agency={agency}
            onBookingCreated={handleBookingCreated}
            availableCredit={availableCredit}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'vouchers' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Meus Vouchers</h3>
            <p className="text-xs text-slate-500">Consulte os vouchers associados às reservas da agência. A emissão real depende da confirmação do pedido pela API.</p>
            {bookings.filter(b => b.qrCode && b.status !== 'Cancelado').length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum voucher disponível.</p>
            ) : bookings.filter(b => b.qrCode && b.status !== 'Cancelado').map(b => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 rounded-xl p-4">
                <div><p className="font-semibold text-sm text-slate-900">{b.groupName}</p><p className="text-xs text-slate-500">{b.id} · {b.visitDate} · {b.ticketsCount} ingressos</p></div>
                <button onClick={() => onOpenVoucher?.(b)} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer">Visualizar voucher de demonstração</button>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'grupos' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Grupos e Excursões</h3>
            <p className="text-xs text-slate-500">Acompanhe a data, o tamanho e a situação de cada grupo.</p>
            {bookings.length === 0 ? <p className="text-sm text-slate-600">Nenhum grupo cadastrado.</p> : bookings.map(b => (
              <div key={b.id} className="flex flex-wrap justify-between gap-3 border border-slate-200 rounded-xl p-4 text-sm">
                <div><strong>{b.groupName}</strong><p className="text-xs text-slate-500">{b.id} · {b.visitDate} às {b.visitTime}</p></div>
                <div className="text-xs text-slate-700">{b.ticketsCount} participantes · {b.status}</div>
              </div>
            ))}
            <button onClick={() => setActiveTab('comprar')} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer">Nova reserva de grupo</button>
          </section>
        )}

        {activeTab === 'dados' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Dados Cadastrais da Agência Parceira</h3>
              <p className="text-xs text-slate-500">Credenciamento B2B ativo junto ao Parque Jaime Lerner (PDT DiskIngressos)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Razão Social</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{agency?.name || "Agência não selecionada"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">CNPJ Normalizado</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">{agency?.cnpj || "—"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Código Credenciamento / Status</span>
                <span className="font-mono font-bold text-emerald-700 mt-0.5 block">{agency?.id || "—"} • {agency?.status || "—"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Responsável Operacional</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{agency?.contactName || "—"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">E-mail B2B</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{agency?.email || "—"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Modalidade de Faturamento</span>
                <span className="font-mono font-bold text-blue-700 mt-0.5 block">Faturamento B2B (15d) / PIX</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'ajuda' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-slate-900">Ajuda e Suporte</h3>
            <p className="text-sm text-slate-600">Para dúvidas sobre ingressos, reservas e credenciamento, acesse o canal de atendimento do Parque.</p>
            <button onClick={() => setActiveTab('contato')} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer">Ver contatos</button>
          </section>
        )}

        {/* Tab: Minhas Reservas */}
        {activeTab === 'reservas' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Minhas Reservas B2B</h3>
                <p className="text-xs text-slate-500">Histórico de reservas da agência autenticada</p>
              </div>
              <button
                onClick={() => setActiveTab('comprar')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                + Nova Reserva
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
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">{brl(b.totalAmount)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenVoucher && onOpenVoucher(b)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold border border-blue-200 flex items-center gap-1.5 mx-auto cursor-pointer"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-fr">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[128px]">
                <span className="text-xs font-semibold text-slate-600 block">Cota de Ingressos do Mês</span>
                <span className="text-lg font-mono font-bold tabular-nums text-slate-900">
                  {brNum(quotaLimit)} ingressos
                </span>
                <div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${usedQuotaPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {brNum(usedQuota)} utilizados ({usedQuotaPct}%)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[128px]">
                <span className="text-xs font-semibold text-slate-600 block">Limite de Faturamento B2B</span>
                <span className="text-lg font-mono font-bold tabular-nums text-slate-900">
                  {brl(creditLimit)}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  {brl(availableCredit)} disponível
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[128px]">
                <span className="text-xs font-semibold text-slate-600 block">Volume Faturado no Período</span>
                <span className="text-lg font-mono font-bold tabular-nums text-slate-900">
                  {brl(totalB2BAmount)}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Referente a {brNum(activeBookings.length)} reservas ativas no período
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Materiais de Divulgação */}
        {activeTab === 'materiais' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shrink-0">
                  <img
                    src="/assets/logo-vale-color-h.png"
                    alt="Logo Oficial Vale da Música"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Kit de Mídia Oficial & Identidade Visual — Vale da Música
                  </h3>
                  <p className="text-xs text-slate-500">
                    Logotipos oficiais, manual da marca e fotografias em alta resolução autorizados para agências B2B
                  </p>
                </div>
              </div>
              <a
                href="/assets/MANUAL_MARCA_valedamusica.pdf"
                download="MANUAL_MARCA_valedamusica.pdf"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Baixar Manual da Marca (PDF)</span>
              </a>
            </div>

            {/* Bloco 1: Logotipos Oficiais e Elementos Gráficos */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Logotipos Oficiais & Elementos Gráficos (PNG Transparente)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
                {[
                  {
                    title: 'Logo Horizontal Colorida',
                    sub: '700×181px • PNG Transparente',
                    file: '/assets/logo-vale-color-h.png',
                    downloadName: 'LOGO-vale-da-musica-horizontal-cor.png',
                    bg: 'bg-slate-50'
                  },
                  {
                    title: 'Logo Vertical (2 Linhas) Colorida',
                    sub: '700×222px • PNG Transparente',
                    file: '/assets/logo-vale-color-v.png',
                    downloadName: 'LOGO-vale-da-musica-vertical-cor.png',
                    bg: 'bg-slate-50'
                  },
                  {
                    title: 'Logo Horizontal Monocromática',
                    sub: '700×181px • PNG Transparente',
                    file: '/assets/logo-vale-preto-h.png',
                    downloadName: 'LOGO-vale-da-musica-monocromatica.png',
                    bg: 'bg-slate-100'
                  },
                  {
                    title: 'Vetor Ondas Sonoras Oficial',
                    sub: '1940×366px • PNG Transparente',
                    file: '/assets/logo-vale-ondas.png',
                    downloadName: 'VETOR-ondas-vale-da-musica.png',
                    bg: 'bg-slate-900'
                  }
                ].map((logo, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between bg-white"
                  >
                    <div className={`h-24 ${logo.bg} p-4 flex items-center justify-center border-b border-slate-100`}>
                      <img
                        src={logo.file}
                        alt={logo.title}
                        className="max-h-14 max-w-full object-contain"
                      />
                    </div>
                    <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">{logo.title}</span>
                        <span className="text-slate-400 text-[11px]">{logo.sub}</span>
                      </div>
                      <a
                        href={logo.file}
                        download={logo.downloadName}
                        className="mt-2.5 w-full py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar PNG</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco 2: Banco de Fotografias Oficiais para Pacotes Turísticos */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Fotografias Oficiais para Divulgação de Excursões e Agências (12 Fotos em Alta Resolução)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
                {[
                  {
                    title: 'Vista Aérea Dourada — Ópera & Lago',
                    sub: 'Foto Oficial de Capa • 1207×681px',
                    file: '/assets/vale-aerea-dourada.png',
                    downloadName: 'vale-da-musica-vista-aerea-dourada.png'
                  },
                  {
                    title: 'Palco Flutuante #VALEDAMÚSICA',
                    sub: 'Lago da Ópera de Arame • 1178×786px',
                    file: '/assets/vale-palco-flutuante.jpg',
                    downloadName: 'vale-da-musica-palco-flutuante.jpg'
                  },
                  {
                    title: 'Música Instrumental ao Vivo',
                    sub: 'Apresentação no Lago • 960×540px',
                    file: '/assets/vale-musica-ao-vivo.jpg',
                    downloadName: 'vale-da-musica-instrumental.jpg'
                  },
                  {
                    title: 'Interior da Ópera de Arame',
                    sub: 'Arquitetura & Público • 736×492px',
                    file: '/assets/vale-opera-interior.jpg',
                    downloadName: 'vale-da-musica-opera-interior.jpg'
                  },
                  {
                    title: 'Passeio pelo Bosque & Natureza',
                    sub: 'Acesso Turístico • 768×432px',
                    file: '/assets/vale-bosque-passeio.jpg',
                    downloadName: 'vale-da-musica-bosque-passeio.jpg'
                  },
                  {
                    title: 'Instalação "Natureza" na Mata',
                    sub: 'Experiência Imersiva • 672×378px',
                    file: '/assets/vale-natureza-neon.jpg',
                    downloadName: 'vale-da-musica-instalacao-natureza.jpg'
                  },
                  {
                    title: 'Espetáculos Culturais no Palco',
                    sub: 'Auditório Principal • 1174×783px',
                    file: '/assets/vale-espetaculo-palco.jpg',
                    downloadName: 'vale-da-musica-espetaculo.jpg'
                  },
                  {
                    title: 'Intervenções Artísticas & Fitas',
                    sub: 'Espetáculo Cênico • 736×492px',
                    file: '/assets/vale-arte-fitas.jpg',
                    downloadName: 'vale-da-musica-arte-fitas.jpg'
                  },
                  {
                    title: 'Oficinas Educativas & Escolas',
                    sub: 'Turismo Pedagógico • 1024×683px',
                    file: '/assets/vale-oficina-educativa.jpg',
                    downloadName: 'vale-da-musica-oficina-educativa.jpg'
                  },
                  {
                    title: 'Lazer para Famílias e Excursões',
                    sub: 'Público & Cultura • 1472×983px',
                    file: '/assets/vale-familia-cultura.jpg',
                    downloadName: 'vale-da-musica-familia-cultura.jpg'
                  },
                  {
                    title: 'Oficina de Arte Curitibana',
                    sub: 'Identidade Cultural • 768×432px',
                    file: '/assets/vale-oficina-arte.jpg',
                    downloadName: 'vale-da-musica-oficina-arte.jpg'
                  },
                  {
                    title: 'Vista Aérea Histórica (P&B)',
                    sub: 'Ópera de Arame & Lago • 1600×900px',
                    file: '/assets/vale-aerea-pb.jpg',
                    downloadName: 'vale-da-musica-vista-aerea.jpg'
                  }
                ].map((photo, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden group flex flex-col justify-between bg-white"
                  >
                    <div className="h-44 bg-slate-950 overflow-hidden relative shrink-0 flex items-center justify-center">
                      <img
                        src={photo.file}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-40"
                      />
                      <img
                        src={photo.file}
                        alt={photo.title}
                        className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">{photo.title}</span>
                        <span className="text-slate-400 text-[11px]">{photo.sub}</span>
                      </div>
                      <a
                        href={photo.file}
                        download={photo.downloadName}
                        className="mt-2.5 w-full py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Foto HD</span>
                      </a>
                    </div>
                  </div>
                ))}
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

    </div>
  );
};
