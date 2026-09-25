import crypto from 'crypto';

/**
 * Service for signing and validating QR Code vouchers for gate check-in
 * Uses HMAC-SHA256 with secret key to prevent forgery at park turnstiles.
 */
export class VoucherSignerService {
  constructor(secretKey = process.env.VOUCHER_SIGNING_SECRET || 'diskingressos-parque-jaime-lerner-secret-2026') {
    this.secretKey = secretKey;
  }

  /**
   * Generates a tamper-proof signed payload for B2B ticket vouchers
   */
  generateSignedVoucher(payload) {
    const dataString = JSON.stringify({
      rid: payload.reservationId,
      aid: payload.agencyId,
      tid: payload.ticketTypeId,
      dt: payload.visitDate,
      seq: payload.seatOrSequence || 1,
      iat: Math.floor(Date.now() / 1000)
    });

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataString)
      .digest('hex')
      .substring(0, 16);

    const base64Data = Buffer.from(dataString).toString('base64url');
    const qrCodePayload = `DISK.B2B.${base64Data}.${signature}`;

    return { qrCodePayload, signature };
  }

  /**
   * Validates a scanned QR Code at Parque Jaime Lerner entrance gates
   */
  verifyVoucher(qrCodeString) {
    try {
      const parts = qrCodeString.split('.');
      if (parts.length !== 4 || parts[0] !== 'DISK' || parts[1] !== 'B2B') {
        return { valid: false, error: 'Formato de voucher DiskIngressos inválido' };
      }

      const base64Data = parts[2];
      const signature = parts[3];

      const jsonString = Buffer.from(base64Data, 'base64url').toString('utf8');
      const expectedSig = crypto
        .createHmac('sha256', this.secretKey)
        .update(jsonString)
        .digest('hex')
        .substring(0, 16);

      if (signature !== expectedSig) {
        return { valid: false, error: 'Assinatura criptográfica inválida (tentativa de falsificação)' };
      }

      const data = JSON.parse(jsonString);
      return { valid: true, data };
    } catch (err) {
      return { valid: false, error: 'Erro ao decodificar voucher: ' + err.message };
    }
  }
}

export const voucherSigner = new VoucherSignerService();
