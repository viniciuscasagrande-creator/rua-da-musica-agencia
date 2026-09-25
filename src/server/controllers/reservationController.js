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
  'tier-inteira': { name: 'Ingresso Geral Inteira', baseCents: 3000 },
  'tier-meia': { name: 'Meia-Entrada Legal', baseCents: 1500 },
  'tier-tour': { name: 'Tour Arquitetônico Guiado', baseCents: 2500 },
  'tier-educativo': { name: 'Educativo (Excursão Escolar)', baseCents: 2000 },
  'tier-sunset': { name: 'Sunset Cultural VIP', baseCents: 4800 },
  'tier-corp': { name: 'Grupo Corporativo', baseCents: 2600 }
};

export const listReservations = async (req, res) => {
  try {
    const { agencyId, status } = req.query;

    if (process.env.DATABASE_URL) {
      try {
        const where = {};
        if (agencyId) where.agencyId = agencyId;
        if (status && status !== 'Todos') {
          const statusMap = {
            'Voucher emitido': 'CONFIRMED',
            'Confirmado': 'CONFIRMED',
            'Pré-reservado': 'HELD',
            'Cancelado': 'CANCELLED'
          };
          if (statusMap[status]) where.status = statusMap[status];
        }

        const dbReservations = await prisma.groupReservation.findMany({
          where,
          include: {
            agency: true,
            passengers: true,
            masterVoucher: true
          },
          orderBy: { createdAt: 'desc' }
        });

        if (dbReservations && dbReservations.length > 0) {
          const formatted = dbReservations.map(r => ({
            id: r.id,
            agencyId: r.agencyId,
            agencyName: r.agency?.tradeName || r.agency?.legalName || 'Agência Credenciada',
            groupName: r.groupName,
            visitDate: r.expiresAt ? r.expiresAt.toISOString().split('T')[0] : '2026-09-28',
            visitTime: '09:00',
            ticketsCount: r.quantity,
            totalAmount: (r.totalAmountCents || 0) / 100,
            baseAmount: ((r.totalAmountCents || 0) - (r.diskFeeAmountCents || 0)) / 100,
            diskFeeAmount: (r.diskFeeAmountCents || 0) / 100,
            guideName: 'Guia Cadastur Credenciado',
            transport: 'Ônibus Executivo',
            status: r.status === 'CONFIRMED' ? 'Voucher emitido' : (r.status === 'CANCELLED' ? 'Cancelado' : 'Pré-reservado'),
            qrCode: r.masterVoucher?.masterQrCode || `RM-B2B-${r.id}-VALID`,
            createdAt: r.createdAt.toISOString().replace('T', ' ').substring(0, 16),
            paymentStatus: r.paymentMethod ? (r.paymentMethod.includes('FATURADO') ? 'Faturado (Cota B2B)' : 'Pago via PIX B2B') : 'Faturado (Cota B2B)',
            checkinCount: r.passengers?.filter(p => p.checkedIn).length || 0,
            passengers: r.passengers || []
          }));

          return res.json({ success: true, count: formatted.length, data: formatted });
        }
      } catch (dbErr) {
        console.warn('[Prisma Reservations Notice] Falling back to memory store:', dbErr.message);
      }
    }

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

    // 5. Persist to Prisma Database
    if (process.env.DATABASE_URL) {
      try {
        const attraction = await prisma.attraction.findFirst();
        const attractionId = attraction ? attraction.id : 'PRQ-JLERNER-001';

        let dbAgency = await prisma.agency.findUnique({ where: { id: agencyId } });
        if (!dbAgency) {
          dbAgency = await prisma.agency.findFirst();
        }
        const finalAgencyId = dbAgency ? dbAgency.id : agencyId;

        await prisma.groupReservation.create({
          data: {
            id: holdResult.reservationId,
            attractionId,
            agencyId: finalAgencyId,
            groupName,
            ticketTypeId: calculatedItems[0]?.ticketTypeId || 'tier-inteira',
            quantity: totalTickets,
            totalAmountCents: grandTotalCents,
            diskFeeAmountCents: totalFeeCents,
            commissionAmountCents: Math.round(grandTotalCents * 0.10),
            status: 'CONFIRMED',
            expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            orderId: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
            paymentMethod: paymentMethod === 'cota' ? 'FATURADO_15D' : 'PIX_B2B',
            idempotencyKey: `IDEMP-${holdResult.reservationId}-${Date.now()}`,
            masterVoucher: {
              create: {
                masterQrCode: qrCodePayload,
                signature: `SIG-${holdResult.reservationId}`,
                isMasterOnly: true
              }
            }
          }
        });
      } catch (dbErr) {
        console.warn('[Prisma Sync Reservation Notice]:', dbErr.message);
      }
    }

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

    if (process.env.DATABASE_URL) {
      try {
        await prisma.groupReservation.update({
          where: { id },
          data: { status: 'CANCELLED' }
        });
      } catch (dbErr) {
        console.warn('[Prisma Cancel Reservation Notice]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: `Reserva ${id} cancelada e ingressos devolvidos ao inventário.`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
