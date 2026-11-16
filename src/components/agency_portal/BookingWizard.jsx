import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Compass,
  GraduationCap,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  Headphones,
  PhoneCall,
  Download,
  Bus,
  CreditCard
} from 'lucide-react';
import { B2B_TICKET_TYPES } from '../../data/mockData';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00'
];

const CALENDAR_DAYS = [
  { day: 1, colStart: 3, status: 'past' },
  { day: 2, status: 'past' },
  { day: 3, status: 'past' },
  { day: 4, status: 'past' },
  { day: 5, status: 'past' },
  { day: 6, status: 'past' },
  { day: 7, status: 'past' },
  { day: 8, status: 'past' },
  { day: 9, status: 'past' },
  { day: 10, status: 'past' },
  { day: 11, status: 'past' },
  { day: 12, status: 'past' },
  { day: 13, status: 'past' },
  { day: 14, status: 'past' },
  { day: 15, status: 'past' },
  { day: 16, status: 'past' },
  { day: 17, status: 'past' },
  { day: 18, status: 'available' },
  { day: 19, status: 'available' },
  { day: 20, status: 'available' },
  { day: 21, status: 'available' },
  { day: 22, status: 'available' },
  { day: 23, status: 'available' },
  { day: 24, status: 'available' },
  { day: 25, status: 'available' },
  { day: 26, status: 'available' },
  { day: 27, status: 'available' },
  { day: 28, status: 'available' },
  { day: 29, status: 'available' },
  { day: 30, status: 'few' }
];

const TICKET_THUMBNAILS = {
  'TKT-INTEIRA': '/assets/vale-palco-flutuante.jpg',
  'TKT-MEIA': '/assets/vale-musica-ao-vivo.jpg',
  'TKT-TOUR': '/assets/vale-bosque-passeio.jpg',
  'TKT-EDUCATIVO': '/assets/vale-oficina-educativa.jpg',
  'TKT-CORPORATIVO': '/assets/vale-opera-interior.jpg'
};

export const BookingWizard = ({ agency, onBookingCreated, availableCredit = 31238, onNavigateTab }) => {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [quantities, setQuantities] = useState({
    'TKT-INTEIRA': 20,
    'TKT-MEIA': 10,
    'TKT-TOUR': 0,
    'TKT-EDUCATIVO': 0,
    'TKT-CORPORATIVO': 0
  });

  const [groupDetails, setGroupDetails] = useState({
    groupName: 'Excursão Curitiba Cultural - Setembro',
    coordinatorName: 'Roberto Almeida',
    coordinatorPhone: '(11) 98765-4321',
    originCity: 'São Paulo - SP',
    transportType: 'Ônibus Executivo Fretado',
    tourGuideName: 'Marcos Viana (CADASTUR)',
    paymentMethod: 'FATURAMENTO_15D',
    notes: 'Grupo chegará com 20 minutos de antecedência no bolsão de ônibus.'
  });

  const [createdReservation, setCreatedReservation] = useState(null);

  const brl = (n) =>
    Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const updateQty = (id, delta) => {
    if (step === 1) setStep(2);
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const selectedItems = B2B_TICKET_TYPES.map((t) => ({
    ...t,
    qty: quantities[t.id] || 0,
    lineBase: (quantities[t.id] || 0) * t.basePrice,
    lineFee: (quantities[t.id] || 0) * t.diskFee,
    lineTotal: (quantities[t.id] || 0) * t.agencyPrice
  })).filter((item) => item.qty > 0);

  const totalTickets = selectedItems.reduce((acc, item) => acc + item.qty, 0);
  const totalBase = selectedItems.reduce((acc, item) => acc + item.lineBase, 0);
  const totalFee = selectedItems.reduce((acc, item) => acc + item.lineFee, 0);
  const totalAmount = selectedItems.reduce((acc, item) => acc + item.lineTotal, 0);

  const formattedDate = `${String(selectedDay).padStart(2, '0')}/09/2026 (Sex)`;
  const isoDate = `2026-09-${String(selectedDay).padStart(2, '0')}`;

  const handleConfirmBooking = () => {
    const code = `RES-B2B-${Math.floor(1050 + Math.random() * 900)}`;
    const newBooking = {
      id: code,
      agencyId: agency?.id,
      agencyName: agency?.name,
      groupName: groupDetails.groupName || 'Grupo B2B Parque Jaime Lerner',
      coordinator: `${groupDetails.coordinatorName} (Cadastrado hoje)`,
      visitDate: isoDate,
      visitTime: selectedTime,
      ticketsCount: totalTickets,
      baseAmount: totalBase,
      diskFeeAmount: totalFee,
      totalAmount: totalAmount,
      status: 'Voucher emitido',
      qrCode: `DISK-${code}-PJL`,
      originCity: groupDetails.originCity,
      transport: groupDetails.transportType,
      items: selectedItems.map((i) => ({
        name: i.name,
        qty: i.qty,
        unitPrice: i.agencyPrice
      }))
    };
    setCreatedReservation(newBooking);
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
    setStep(5);
  };

  const renderTicketIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-blue-600" />;
      case 'graduation':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      default:
        return <Ticket className="w-4 h-4 text-blue-600" />;
    }
  };

  const stepsList = [
    { num: 1, label: 'Selecionar Data' },
    { num: 2, label: 'Escolher Ingressos' },
    { num: 3, label: 'Detalhes do Grupo' },
    { num: 4, label: 'Revisar e Pagar' },
    { num: 5, label: 'Confirmar e Receber' }
  ];

  return (
    <div className="space-y-4">
      {/* Top 5-Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 px-4 py-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {stepsList.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => s.num < 5 && setStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : isDone
                    ? 'text-emerald-700 hover:bg-slate-50'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Steps + Right Reservation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          {(step === 1 || step === 2) && (
            <>
              {/* Block 1: Selecione a data da visita & Horário */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900">1. Selecione a data da visita</h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  {/* Calendar Widget */}
                  <div className="md:col-span-7 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-800">Setembro 2026</span>
                      <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-2">
                      <span>DOM</span>
                      <span>SEG</span>
                      <span>TER</span>
                      <span>QUA</span>
                      <span>QUI</span>
                      <span>SEX</span>
                      <span>SÁB</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                      <div />
                      <div />
                      {CALENDAR_DAYS.map((d) => {
                        const isSelected = selectedDay === d.day;
                        const isAvail = d.status === 'available' || d.status === 'few';
                        return (
                          <button
                            key={d.day}
                            disabled={!isAvail}
                            onClick={() => setSelectedDay(d.day)}
                            className={`h-8 rounded-lg font-semibold transition-all flex items-center justify-center ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : d.status === 'available'
                                ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                                : d.status === 'few'
                                ? 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Disponível
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        Poucos ingressos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        Indisponível
                      </span>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 mb-2.5">Horário de visita</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const active = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                active
                                  ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-blue-950 block">Recomendado para grupos</span>
                        <span className="text-blue-800 text-[11px]">
                          Chegue com 15 minutos de antecedência.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 2: Escolha os ingressos e a quantidade */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900">2. Escolha os ingressos e a quantidade</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-2.5 px-3">Tipo de Ingresso</th>
                        <th className="py-2.5 px-3">Descrição</th>
                        <th className="py-2.5 px-3">Valor Unitário B2B</th>
                        <th className="py-2.5 px-3 text-center">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {B2B_TICKET_TYPES.map((t) => {
                        const qty = quantities[t.id] || 0;
                        return (
                          <tr key={t.id} className="hover:bg-slate-50/70">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={TICKET_THUMBNAILS[t.id] || '/assets/vale-palco-flutuante.jpg'}
                                  alt={t.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                                />
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                  {renderTicketIcon(t.iconType)}
                                </div>
                                <span className="font-bold text-slate-900">{t.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-slate-700 font-semibold">
                              {t.description}
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold text-sm text-slate-950">
                              R$ {t.agencyPrice.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => updateQty(t.id, -1)}
                                  className="w-7 h-7 rounded-lg border border-blue-300 bg-blue-50/50 hover:bg-blue-100 font-bold text-slate-900 flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-mono font-bold text-sm text-slate-950">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => updateQty(t.id, 1)}
                                  className="w-7 h-7 rounded-lg border border-blue-300 bg-blue-50/50 hover:bg-blue-100 font-bold text-slate-900 flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50/90 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-blue-900">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Tarifário oficial exclusivo para agências credenciadas com emissão imediata de vouchers em lote.
                  </span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Detalhes do Grupo / Excursão</h2>
                  <p className="text-xs text-slate-500">
                    Informações operacionais para recepção e check-in em lote no Parque Jaime Lerner
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Voltar aos ingressos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nome do Grupo / Excursão *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.groupName}
                    onChange={(e) => setGroupDetails({ ...groupDetails, groupName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Responsável pelo Grupo (Guia/Coordenador) *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.coordinatorName}
                    onChange={(e) =>
                      setGroupDetails({ ...groupDetails, coordinatorName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Celular / WhatsApp do Responsável *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.coordinatorPhone}
                    onChange={(e) =>
                      setGroupDetails({ ...groupDetails, coordinatorPhone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Cidade / UF de Origem dos Turistas *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.originCity}
                    onChange={(e) => setGroupDetails({ ...groupDetails, originCity: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Meio de Transporte / Placa (Bolsão de Embarque)
                  </label>
                  <input
                    type="text"
                    value={groupDetails.transportType}
                    onChange={(e) =>
                      setGroupDetails({ ...groupDetails, transportType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Guia Credenciado / CADASTUR
                  </label>
                  <input
                    type="text"
                    value={groupDetails.tourGuideName}
                    onChange={(e) =>
                      setGroupDetails({ ...groupDetails, tourGuideName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Observações Operacionais (Acessibilidade, restrições, horário previsto)
                  </label>
                  <textarea
                    rows={3}
                    value={groupDetails.notes}
                    onChange={(e) => setGroupDetails({ ...groupDetails, notes: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Avançar para Revisão e Pagamento
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    4. Revisão Financeira B2B & Forma de Liquidação
                  </h2>
                  <p className="text-xs text-slate-500">
                    Confira o resumo do lote selecionado e escolha a modalidade de pagamento B2B da agência
                  </p>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Editar grupo
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-fr text-xs">
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex flex-col justify-between h-[88px]">
                  <span className="text-slate-500 font-semibold block">Data & Horário da Visita</span>
                  <span className="text-base font-mono font-bold tabular-nums tracking-tight text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
                    {formattedDate} • {selectedTime}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex flex-col justify-between h-[88px]">
                  <span className="text-slate-500 font-semibold block">Quantidade Total do Lote</span>
                  <span className="text-lg font-mono font-bold tabular-nums tracking-tighter text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {totalTickets} ingressos
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex flex-col justify-between h-[88px]">
                  <span className="text-slate-500 font-semibold block">Total Faturado para Agência</span>
                  <span className="text-lg font-mono font-bold tabular-nums tracking-tighter text-emerald-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-800 block">
                  Modalidade de Pagamento B2B
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-fr">
                  {[
                    {
                      id: 'FATURAMENTO_15D',
                      title: 'Faturamento Cota B2B (15 dias)',
                      desc: `Débito no limite aprovado (${brl(availableCredit)} disponível)`
                    },
                    {
                      id: 'PIX_IMEDIATO',
                      title: 'PIX Corporativo Instantâneo',
                      desc: 'Liberação imediata do lote de QR Codes'
                    },
                    {
                      id: 'BOLETO_B2B',
                      title: 'Boleto Registrado B2B',
                      desc: 'Reserva mantida como HELD por até 48h'
                    }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setGroupDetails({ ...groupDetails, paymentMethod: m.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[88px] cursor-pointer ${
                        groupDetails.paymentMethod === m.id
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>{m.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={totalTickets === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-xs"
                >
                  Confirmar Reserva e Emitir Vouchers B2B
                </button>
              </div>
            </div>
          )}

          {step === 5 && createdReservation && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Reserva Confirmada no Motor Único PDT
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Reserva {createdReservation.id} emitida com sucesso!
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    O lote de {createdReservation.ticketsCount} ingressos para o grupo{' '}
                    <strong>{createdReservation.groupName}</strong> já está vinculado ao check-in do
                    Parque Jaime Lerner.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Código Reserva</span>
                  <span className="font-mono font-bold text-blue-600">{createdReservation.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Data & Horário</span>
                  <span className="font-bold text-slate-800">
                    {createdReservation.visitDate} às {createdReservation.visitTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quantidade</span>
                  <span className="font-bold text-slate-800">
                    {createdReservation.ticketsCount} visitantes
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Valor Total B2B</span>
                  <span className="font-black text-emerald-700">
                    R$ {createdReservation.totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Fazer Nova Reserva B2B
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Resumo da Reserva + Benefícios + Card Promo */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {/* Resumo da Reserva Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Resumo da Reserva</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Data selecionada
              </span>
            </div>

            <div className="space-y-2 text-xs border-b border-blue-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Data da visita
                </span>
                <span className="font-mono font-bold text-slate-950">{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Horário
                </span>
                <span className="font-mono font-bold text-slate-950">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Quantidade total
                </span>
                <span className="font-mono font-bold text-slate-950">{totalTickets} ingressos</span>
              </div>
            </div>

            {/* Selected Items Breakdown */}
            <div className="space-y-1.5 text-xs border-b border-blue-100 pb-3">
              {selectedItems.length === 0 ? (
                <p className="text-slate-500 italic">Nenhum ingresso selecionado</p>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-slate-800 font-medium">
                    <span>
                      {item.qty} x {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-950">
                      R$ {item.lineTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-bold text-slate-800">Valor Total da Reserva</span>
              <span className="text-lg font-mono font-bold tabular-nums tracking-tighter text-blue-700">
                R$ {totalAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={totalTickets === 0}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>{step === 1 ? 'Confirmar Data e Ingressos' : 'Continuar'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : step === 4 ? (
              <button
                onClick={handleConfirmBooking}
                disabled={totalTickets === 0}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Confirmar e Emitir Vouchers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Benefícios para Agências */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900">Benefícios para Agências</h3>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              {[
                'Tarifário especial exclusivo para agências credenciadas',
                'Emissão de vouchers em lote',
                'Facilidade para grupos e excursões',
                'Suporte dedicado DiskIngressos',
                'Materiais de divulgação do Parque',
                'Acompanhamento em tempo real das reservas'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Promotional Media Download Banner (Sem Corte na Imagem) */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-950 text-white">
            <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
              <img
                src="/assets/vale-musica-ao-vivo.jpg"
                alt="Parque Jaime Lerner • Vale da Música"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs inline-flex items-center">
                <img
                  src="/assets/logo-vale-color-h.png"
                  alt="Vale da Música"
                  className="h-3.5 w-auto object-contain"
                />
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between gap-3 border-t border-white/10">
              <div className="min-w-0">
                <h4 className="text-xs font-bold leading-snug text-white">
                  Leve seus clientes para viver essa experiência!
                </h4>
                <p className="text-[10px] text-slate-300 mt-0.5 truncate">
                  Parque Jaime Lerner • Vale da Música — Curitiba - PR
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('materiais')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Materiais</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar (Exact replica of screenshot 11_30_25) */}
      <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-bold text-slate-800 block">Compra Segura</span>
            <span className="text-[11px] text-slate-500">Seus dados protegidos</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Ticket className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-bold text-slate-800 block">Vouchers Instantâneos</span>
            <span className="text-[11px] text-slate-500">Receba por e-mail e no painel</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Headphones className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-bold text-slate-800 block">Suporte Especializado</span>
            <span className="text-[11px] text-slate-500">Para agências e grupos</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <PhoneCall className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-bold text-slate-800 block">Fale Conosco</span>
            <span className="text-[11px] text-slate-500">(41) 3039-2030</span>
          </div>
        </div>
      </div>
    </div>
  );
};
