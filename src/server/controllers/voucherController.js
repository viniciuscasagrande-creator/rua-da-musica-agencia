import { voucherSigner } from '../services/voucherSigner.js';
import { BOOKINGS_LIST } from '../../data/mockData.js';
import { localBookings } from './reservationController.js';

// Registry of already validated vouchers to guarantee single-use entry
const usedVouchersRegistry = new Map();

export const validateVoucher = async (req, res) => {
  try {
    const { qrCodeString, qrCodePayload, reservationId, turnstileId = 'CAT-02' } = req.body;
    const rawQr = qrCodeString || qrCodePayload;

    if (!rawQr && !reservationId) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Informe a string do QR Code ou o ID da Reserva para validação na catraca.'
      });
    }

    let targetReservationId = reservationId;
    let decodedData = null;

    // 1. Verify Cryptographic HMAC Signature if QR code string is supplied
    if (rawQr) {
      const verification = voucherSigner.verifyVoucher(rawQr);
      if (!verification.valid) {
        return res.status(401).json({
          success: false,
          valid: false,
          error: `Fraude / Assinatura Inválida: ${verification.error}`
        });
      }
      decodedData = verification.data;
      targetReservationId = decodedData.rid || reservationId;
    }

    // 2. Lookup reservation in the Core Ticket Store (Dynamic localBookings or Mock)
    const booking = (localBookings && localBookings.find(b => b.id === targetReservationId)) ||
      BOOKINGS_LIST.find(b => b.id === targetReservationId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        valid: false,
        error: `Reserva "${targetReservationId}" não encontrada no sistema de bilheteria do Parque Jaime Lerner.`
      });
    }

    // 3. Check Reservation & Order Status (Cannot check-in if Cancelled)
    if (booking.status === 'Cancelado') {
      return res.status(403).json({
        success: false,
        valid: false,
        error: 'ACESSO NEGADO: Esta reserva foi cancelada e os ingressos foram estornados.'
      });
    }

    // 4. Check Single-Use Constraint (Protection against duplicate entry / ticket cloning)
    const voucherKey = qrCodeString || targetReservationId;
    if (usedVouchersRegistry.has(voucherKey)) {
      const prevCheckin = usedVouchersRegistry.get(voucherKey);
      return res.status(409).json({
        success: false,
        valid: false,
        duplicate: true,
        error: `ALERTA DE SEGURANÇA: Voucher já utilizado anteriormente em ${prevCheckin.usedAt} na ${prevCheckin.turnstileId}. Entrada duplicada bloqueada.`,
        firstCheckin: prevCheckin
      });
    }

    // 5. Register Entry and Transition Status
    const nowTimestamp = new Date().toLocaleString('pt-BR');
    const checkinRecord = {
      reservationId: booking.id,
      groupName: booking.groupName,
      agencyName: booking.agencyName,
      ticketsCount: booking.ticketsCount,
      turnstileId,
      usedAt: nowTimestamp,
      operator: 'Fiscal de Portaria - Parque Jaime Lerner'
    };

    usedVouchersRegistry.set(voucherKey, checkinRecord);
    booking.checkinCount = booking.ticketsCount;
    booking.status = 'Concluído';
    booking.usedAt = nowTimestamp;

    res.json({
      success: true,
      valid: true,
      message: `Acesso autorizado para o grupo "${booking.groupName}" (${booking.ticketsCount} visitantes).`,
      checkinTimestamp: nowTimestamp,
      turnstileId,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
