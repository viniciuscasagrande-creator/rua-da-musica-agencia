import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Users,
  Compass,
  GraduationCap,
  Briefcase,
  Info,
  CheckCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Printer,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { TICKET_CATALOG } from '../../data/mockData';

export const BookingWizard = ({ onBookingCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(18); // 18 de Setembro
  const [selectedTime, setSelectedTime] = useState('09:00');
  
  const availableMonths = [
    { name: 'Agosto 2026', offset: 6, days: 31 },
    { name: 'Setembro 2026', offset: 2, days: 30 },
    { name: 'Outubro 2026', offset: 4, days: 31 },
    { name: 'Novembro 2026', offset: 0, days: 30 },
    { name: 'Dezembro 2026', offset: 2, days: 31 }
  ];
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // Setembro 2026
  
  // Initial tickets matching screenshot 11_30_25 (20 Inteira, 10 Meia)
  const [quantities, setQuantities] = useState({
    'ing-inteira': 20,
    'ing-meia': 10,
    'ing-tour': 0,
    'ing-educativo': 0,
    'ing-corp': 0
  });

  // Group Details Form
  const [groupDetails, setGroupDetails] = useState({
    groupName: 'Excursão Colégio Positivo 3º Ano',
    leaderName: 'Prof. Cláudio Sampaio',
    leaderPhone: '(41) 99877-3322',
    busCompany: 'Viação Graciosa - Placa BEQ-4G90',
    guideCadastur: 'PR-18.092.332 - Juliana Becker',
    notes: 'Grupo escolar de 30 alunos com chegada programada às 08:45.'
  });

  const [paymentMethod, setPaymentMethod] = useState('cota'); // 'cota', 'pix', 'boleto'
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const timeslots = [
    '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00'
  ];

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculate totals
  const totalTickets = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  const subtotal = TICKET_CATALOG.reduce((acc, ticket) => {
    const qty = quantities[ticket.id] || 0;
    return acc + qty * ticket.finalPrice;
  }, 0);

  const totalBase = TICKET_CATALOG.reduce((acc, ticket) => {
    const qty = quantities[ticket.id] || 0;
    return acc + qty * ticket.basePrice;
  }, 0);

  const totalFee = subtotal - totalBase;

  const monthNumbers = ['08', '09', '10', '11', '12'];
  const currentMonthNum = monthNumbers[currentMonthIndex] || '09';

  const handleFinishBooking = async () => {
    setSubmitting(true);
    setApiError(null);

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        ticketTypeId: id,
        quantity: qty
      }));

    try {
      const response = await fetch('/api/b2b/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId: 'ag-06',
          agencyName: 'Agência Turismo Brasil',
          groupName: groupDetails.groupName,
          visitDate: `2026-${currentMonthNum}-${String(selectedDay).padStart(2, '0')}`,
          visitTime: selectedTime,
          items,
          guideName: groupDetails.guideCadastur,
          transport: groupDetails.busCompany,
          paymentMethod
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Falha ao emitir reserva e vouchers.');
      }

      setConfirmedBooking(result.data);
      onBookingCreated && onBookingCreated(result.data);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Reservation API Error:', err);
      setApiError(err.message || 'Erro de comunicação com o servidor do Parque.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Data & Ingressos' },
    { num: 3, label: 'Detalhes do Grupo' },
    { num: 4, label: 'Revisão & Pagamento' },
    { num: 5, label: 'Vouchers B2B' }
  ];

  const canGoToStep = (targetNum) => {
    if (targetNum <= 2) return true;
    if (targetNum === 3) return totalTickets > 0;
    if (targetNum === 4) return totalTickets > 0 && !!groupDetails.groupName;
    if (targetNum === 5) return !!confirmedBooking;
    return false;
  };

  return (
    <div className="space-y-6">
      
      {/* 5-Step Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((st, idx) => {
            const isActive = (st.num === 1 && currentStep <= 2) || currentStep === st.num;
            const isCompleted = currentStep > st.num;
            const isAllowed = canGoToStep(st.num);

            return (
              <div key={st.num} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    if (isAllowed) {
                      setCurrentStep(st.num <= 2 ? 1 : st.num);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={!isAllowed}
                  className={`flex items-center gap-2 text-xs font-semibold focus:outline-none transition-all ${
                    isAllowed ? 'cursor-pointer hover:opacity-85' : 'cursor-not-allowed opacity-40'
                  }`}
                  title={isAllowed ? `Ir para ${st.label}` : 'Complete a etapa anterior para habilitar'}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : (idx + 1)}
                  </div>
                  <span
                    className={`hidden sm:inline transition-colors ${
                      isActive
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 hidden md:block rounded ${
                      currentStep > st.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Content: Flow View (col-8) + Sticky Reservation Summary (col-4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Step Screens */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* STEP 1 & 2 (Combined View matching screenshot 11_30_25) */}
          {(currentStep === 1 || currentStep === 2) && (
            <div className="space-y-6">
              
              {/* Box 1: Selecione a data da visita */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h3 className="font-bold text-sm text-slate-900">Selecione a data da visita</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Calendar Widget */}
                  <div className="md:col-span-7 bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentMonthIndex === 0}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Mês anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-slate-800">{availableMonths[currentMonthIndex].name}</span>
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex(prev => Math.min(availableMonths.length - 1, prev + 1))}
                        disabled={currentMonthIndex === availableMonths.length - 1}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Próximo mês"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
                      <span>DOM</span>
                      <span>SEG</span>
                      <span>TER</span>
                      <span>QUA</span>
                      <span>QUI</span>
                      <span>SEX</span>
                      <span>SÁB</span>
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {/* Empty days for offset */}
                      {Array.from({ length: availableMonths[currentMonthIndex].offset }).map((_, i) => (
                        <span key={`empty-${i}`} />
                      ))}
                      
                      {Array.from({ length: availableMonths[currentMonthIndex].days }, (_, i) => i + 1).map((d) => {
                        const isPast = currentMonthIndex === 1 && d < 18;
                        const isSelected = selectedDay === d;

                        if (isPast) {
                          return (
                            <div key={d} className="h-8 flex items-center justify-center text-slate-300 font-medium cursor-not-allowed">
                              {d}
                            </div>
                          );
                        }

                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300 border-blue-600 shadow-xs'
                                : d === 19
                                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>

                    {/* Calendar Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Disponível</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Poucos ingressos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Indisponível</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeslot Picker */}
                  <div className="md:col-span-5 flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Horário de visita
                      </label>

                      <div className="grid grid-cols-3 gap-2">
                        {timeslots.map((slot) => {
                          const isSelected = selectedTime === slot;

                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-xs ring-1 ring-blue-600'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tip Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-blue-900 leading-snug">
                        <strong className="block font-semibold">Recomendado para grupos</strong>
                        Chegue com 15 minutos de antecedência para facilitar o desembarque e credenciamento na catraca.
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Box 2: Escolha os ingressos e a quantidade */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="font-bold text-sm text-slate-900">Escolha os ingressos e a quantidade</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Tipo de Ingresso</th>
                        <th className="py-3 px-4">Descrição</th>
                        <th className="py-3 px-4">Preço Base</th>
                        <th className="py-3 px-4">Taxa B2B (6%)</th>
                        <th className="py-3 px-4 font-bold text-slate-700">Preço para Agência</th>
                        <th className="py-3 px-4 text-center">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {TICKET_CATALOG.map((ticket) => {
                        const qty = quantities[ticket.id] || 0;

                        return (
                          <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                  {ticket.id === 'ing-inteira' && <User className="w-4 h-4" />}
                                  {ticket.id === 'ing-meia' && <Users className="w-4 h-4" />}
                                  {ticket.id === 'ing-tour' && <Compass className="w-4 h-4" />}
                                  {ticket.id === 'ing-educativo' && <GraduationCap className="w-4 h-4" />}
                                  {ticket.id === 'ing-corp' && <Briefcase className="w-4 h-4" />}
                                </div>
                                <span>{ticket.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs">
                              {ticket.description}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-600">
                              R$ {ticket.basePrice.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              R$ {ticket.feeAmount.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                              R$ {ticket.finalPrice.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(ticket.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-9 text-center font-bold text-slate-800 text-xs">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(ticket.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Info Note on Bottom */}
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 mt-4 flex items-center gap-2.5 text-blue-900 text-xs">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    A taxa administrativa B2B de 6% já está incluída no valor final para a agência.
                  </span>
                </div>
              </div>

              {/* Advance Action Footer for Step 1/2 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Total selecionado:</span>
                  <span className="text-sm font-black text-slate-900">
                    {totalTickets} ingressos • <span className="text-blue-700">R$ {subtotal.toFixed(2)}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (totalTickets > 0) {
                      setCurrentStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={totalTickets === 0}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Detalhes do Grupo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Detalhes do Grupo e Excursão */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h3 className="font-bold text-base text-slate-900">Identificação do Grupo & Logística</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Dados impressos no lote de vouchers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome da Excursão / Grupo *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.groupName}
                    onChange={(e) => setGroupDetails({ ...groupDetails, groupName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Responsável pelo Grupo *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.leaderName}
                    onChange={(e) => setGroupDetails({ ...groupDetails, leaderName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp / Celular de Contato *
                  </label>
                  <input
                    type="text"
                    value={groupDetails.leaderPhone}
                    onChange={(e) => setGroupDetails({ ...groupDetails, leaderPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Transporte / Placa do Veículo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={groupDetails.busCompany}
                    onChange={(e) => setGroupDetails({ ...groupDetails, busCompany: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Guia de Turismo / Cadastur
                  </label>
                  <input
                    type="text"
                    value={groupDetails.guideCadastur}
                    onChange={(e) => setGroupDetails({ ...groupDetails, guideCadastur: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Observações de Acessibilidade / Restrições
                  </label>
                  <textarea
                    rows={2}
                    value={groupDetails.notes}
                    onChange={(e) => setGroupDetails({ ...groupDetails, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (groupDetails.groupName) {
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={!groupDetails.groupName}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Avançar para Pagamento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Revisar e Pagar */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="font-bold text-base text-slate-900">Revisão do Pedido & Condição de Pagamento B2B</h3>
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Grupo / Excursão:</span>
                  <span>{groupDetails.groupName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Data e Horário:</span>
                  <span>{selectedDay}/09/2026 às {selectedTime}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total de Ingressos Reservados:</span>
                  <span className="font-bold text-blue-600">{totalTickets} ingressos</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Valor Total da Reserva B2B:</span>
                  <span className="text-blue-700 font-black">R$ {subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Forma de Pagamento Credenciada
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod('cota')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cota'
                        ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">Faturar na Cota</span>
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">Prazo 15 dias • Consome limite de crédito da agência</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">PIX B2B Instantâneo</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Imediato</span>
                    </div>
                    <p className="text-[11px] text-slate-500">QR Code dinâmico com baixa instantânea na catraca</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'boleto'
                        ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">Boleto Bancário</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Vencimento em 3 dias úteis para excursões programadas</p>
                  </div>
                </div>
              </div>

              {apiError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleFinishBooking}
                  disabled={submitting || totalTickets === 0}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processando reserva...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirmar e Emitir Vouchers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmar e Receber (Success Screen) */}
          {currentStep === 5 && confirmedBooking && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Reserva Confirmada com Sucesso!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Código da Reserva: <strong className="font-mono text-blue-600 text-sm">{confirmedBooking.id}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Atração:</span>
                  <span className="font-bold text-slate-800">Parque Jaime Lerner - Curitiba</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data e Horário:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.visitDate} às {confirmedBooking.visitTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grupo:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total de Ingressos:</span>
                  <span className="font-bold text-blue-600">{confirmedBooking.ticketsCount} visitantes</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                  <span>Valor Total Faturado:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">R$ {confirmedBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Signed Turnstile Voucher Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-lg border border-blue-900 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-blue-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-200">Voucher B2B Assinado</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> HMAC-SHA256
                  </span>
                </div>

                <div className="bg-white text-slate-900 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="overflow-hidden space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Código Criptográfico da Catraca</span>
                    <p className="font-mono text-xs font-bold text-blue-700 truncate" title={confirmedBooking.qrCode}>
                      {confirmedBooking.qrCode}
                    </p>
                    <span className="text-[11px] text-slate-600 block">
                      Válido para entrada de <strong>{confirmedBooking.ticketsCount} pessoas</strong> em <strong>{confirmedBooking.visitDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-blue-200/80 pt-1">
                  <span>Validação: Catraca Parque Jaime Lerner</span>
                  <span className="text-emerald-400 font-semibold">Uso Único • Anti-fraude</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Lote de Vouchers (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setApiError(null);
                    setCurrentStep(1);
                    setQuantities({
                      'ing-inteira': 20,
                      'ing-meia': 10,
                      'ing-tour': 0,
                      'ing-educativo': 0,
                      'ing-corp': 0
                    });
                    setGroupDetails({
                      groupName: 'Nova Excursão',
                      leaderName: '',
                      leaderPhone: '',
                      busCompany: '',
                      guideCadastur: '',
                      notes: ''
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Reserva para Agência</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Column: Resumo da Reserva & Benefícios */}
        <div className="xl:col-span-4 space-y-4">
          
          {/* Card 1: Resumo da Reserva */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Resumo da Reserva</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Data selecionada
              </span>
            </div>

            <div className="py-3 space-y-2.5 text-xs border-b border-slate-100">
              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <span>Data da visita</span>
                </div>
                <span className="font-bold text-slate-900">{selectedDay}/{currentMonthNum}/2026</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Horário</span>
                </div>
                <span className="font-bold text-slate-900">{selectedTime}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Quantidade total</span>
                </div>
                <span className="font-extrabold text-blue-600">{totalTickets} ingressos</span>
              </div>
            </div>

            {/* Breakdown of items */}
            <div className="py-3 space-y-1.5 text-xs border-b border-slate-100">
              {TICKET_CATALOG.filter(t => quantities[t.id] > 0).map(t => (
                <div key={t.id} className="flex justify-between text-slate-700">
                  <span>{quantities[t.id]} x {t.name}</span>
                  <span className="font-semibold">R$ {(quantities[t.id] * t.finalPrice).toFixed(2)}</span>
                </div>
              ))}
              {totalTickets === 0 && (
                <span className="text-slate-400 italic block py-1 text-center">Nenhum ingresso selecionado</span>
              )}
            </div>

            {/* Subtotal */}
            <div className="pt-3 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  Subtotal (com taxa B2B 6%)
                </span>
                <span className="text-lg font-black text-blue-700">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Advance Button */}
            {currentStep < 4 && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep <= 2) {
                    setCurrentStep(3);
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={totalTickets === 0}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{currentStep <= 2 ? 'Continuar para Detalhes' : 'Avançar para Pagamento'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Card 2: Benefícios para Agências */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h4 className="font-bold text-xs text-slate-900 mb-3">Benefícios para Agências</h4>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Preço especial B2B com taxa de 6% já incluída</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Emissão de vouchers em lote</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Facilidade para grupos e excursões</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suporte comercial do Parque Jaime Lerner</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Materiais de divulgação do Parque</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Acompanhamento em tempo real das reservas</span>
              </div>
            </div>
          </div>

          {/* Card 3: Download Promo Materials Card */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative group h-44">
            <img
              src="/assets/parque-sunset.jpg"
              alt="Leve seus clientes para viver essa experiência"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-4 flex flex-col justify-end text-white">
              <h4 className="font-extrabold text-sm leading-tight">
                Leve seus clientes para viver essa experiência!
              </h4>
              <p className="text-[10px] text-slate-300 mt-0.5 mb-2.5">
                Parque Jaime Lerner • Rua da Música - Curitiba - PR
              </p>
              
              <button
                onClick={() => alert("Download do Kit de Mídia B2B (Fotos em alta resolução, folders e textos promocionais) iniciado!")}
                className="w-full py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Baixar Materiais</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Trust Badges (Matching Screenshot 11_30_25) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">Compra Segura</span>
            <span className="text-[11px] text-slate-400">Seus dados protegidos</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">Vouchers Instantâneos</span>
            <span className="text-[11px] text-slate-400">Receba por e-mail e no painel</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">Suporte Especializado</span>
            <span className="text-[11px] text-slate-400">Para agências e grupos</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">Fale Conosco</span>
            <span className="text-[11px] text-slate-400">(41) 3039-2030</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao mapa de produtos</span>
        </button>
      </div>

    </div>
  );
};
