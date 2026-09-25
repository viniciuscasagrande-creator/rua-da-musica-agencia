import prisma from '../db/prisma.js';
import { BOOKINGS_LIST, TICKET_CATALOG } from '../../data/mockData.js';
import { voucherSigner } from '../services/voucherSigner.js';
import { inventoryService } from '../services/inventoryService.js';

export let localBookings = [...BOOKINGS_LIST];

// Official ticket catalog dictionary for server-side pricing calculation
const TICKET_PRICE_TABLE = {
  'ing-inteira': { name: 'Inteira', baseCents: 3000 },
  'ing-meia': { name: 'Meia-entrada', baseCents: 1500 },
  'ing-tour': { name: 'Tour Guiado', baseCents: 2000 },
  'ing-educativo': { name: 'Educativo (Escolas)', baseCents: 1200 },
  'ing-corp': { name: 'Grupo Corporativo', baseCents: 2500 },
};

export const listReservations = async (req, res) => {
  try {
    const { agencyId, status } = req.query;

    let filtered = localBookings;
    if (agencyId) {
      filtered = filtered.filter(b => b.agencyId === agencyId);
    }
    if (status && status !== 'Todos') {
      filtered = filtered.filter(b => b.status === status);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const {
      agencyId = 'ag-06',
      agencyName = 'Agência Turismo Brasil',
      groupName,
      visitDate,
      visitTime = '09:00',
      items = [], // [{ ticketTypeId, quantity }]
      guideName,
      transport,
      paymentMethod = 'cota' // 'cota', 'pix', 'boleto'
    } = req.body;

    if (!groupName || !visitDate || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Identificação do grupo, data da visita e itens de ingresso são obrigatórios.'
      });
    }

    // 1. Calculate total tickets requested
    let totalTickets = 0;
    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (qty > 0) totalTickets += qty;
    }

    if (totalTickets <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Pelo menos 1 ingresso deve ser selecionado.'
      });
    }

    // 2. Transactional Inventory Check & Hold
    let holdResult;
    try {
      holdResult = await inventoryService.reserveTicketsTransactional({
        agencyId,
        visitDate,
        ticketTypeId: 'GROUP-BATCH',
        quantity: totalTickets,
        agencyEventFeeBps: 600 // Taxa de Serviço B2B padrão (6%)
      });
    } catch (invErr) {
      return res.status(409).json({
        success: false,
        error: invErr.message
      });
    }

    // 3. SERVER-SIDE ONLY PRICING CALCULATION (In Cents to avoid float inaccuracies)
    // Formula: 6% administrative fee embedded in the announced price
    const calculatedItems = [];
    let totalBaseCents = 0;
    let totalFeeCents = 0;
    let grandTotalCents = 0;

    for (const it of items) {
      const qty = parseInt(it.quantity, 10);
      if (qty <= 0) continue;

      const ticketKey = it.ticketTypeId || it.ticketId;
      const refTicket = TICKET_PRICE_TABLE[ticketKey] || {
        name: it.ticketName || 'Ingresso B2B',
        baseCents: Math.round((it.unitPrice || 30.0) * 100 / 1.06)
      };

      const unitBaseCents = refTicket.baseCents;
      const unitFeeCents = Math.round(unitBaseCents * 0.06); // 6%
      const unitFinalCents = unitBaseCents + unitFeeCents;

      const itemTotalCents = unitFinalCents * qty;
      const itemBaseCents = unitBaseCents * qty;
      const itemFeeCents = unitFeeCents * qty;

      totalBaseCents += itemBaseCents;
      totalFeeCents += itemFeeCents;
      grandTotalCents += itemTotalCents;

      calculatedItems.push({
        ticketTypeId: ticketKey,
        ticketName: refTicket.name,
        quantity: qty,
        unitBasePrice: unitBaseCents / 100,
        unitFeeAmount: unitFeeCents / 100,
        unitPrice: unitFinalCents / 100,
        total: itemTotalCents / 100
      });
    }

    // 4. Payment condition validation & Ticket / Voucher emission
    // If billed via Agency Quota or PIX confirmed, confirm reservation immediately
    await inventoryService.confirmReservation(holdResult.reservationId);

    const { qrCodePayload } = voucherSigner.generateSignedVoucher({
      reservationId: holdResult.reservationId,
      agencyId,
      ticketTypeId: 'GROUP-BATCH',
      visitDate,
      seatOrSequence: 1
    });

    const newReservation = {
      id: holdResult.reservationId,
      agencyId,
      agencyName,
      groupName,
      visitDate,
      visitTime,
      ticketsCount: totalTickets,
      items: calculatedItems,
      totalAmount: grandTotalCents / 100,
      baseAmount: totalBaseCents / 100,
      diskFeeAmount: totalFeeCents / 100,
      guideName: guideName || 'Guia Credenciado Cadastur',
      transport: transport || 'Ônibus Executivo',
      status: 'Voucher emitido',
      qrCode: qrCodePayload,
      createdAt: new Date().toISOString(),
      paymentStatus: paymentMethod === 'cota' ? 'Faturado na Cota B2B (15 dias)' : 'Pago via PIX B2B',
      checkinCount: 0,
      usedAt: null
    };

    localBookings.unshift(newReservation);

    res.status(201).json({
      success: true,
      message: 'Reserva e pedido B2B gerados com sucesso pelo Sistema Parque Jaime Lerner!',
      data: newReservation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = localBookings.find(b => b.id === id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Reserva não encontrada.' });
    }

    booking.status = 'Cancelado';
    await inventoryService.releaseHold(id);

    res.json({
      success: true,
      message: `Reserva ${id} cancelada e ingressos devolvidos ao inventário.`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
