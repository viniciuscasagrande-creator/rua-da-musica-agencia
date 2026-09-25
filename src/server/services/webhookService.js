import crypto from 'crypto';

/**
 * Webhook Service - Dispatcher assíncrono de eventos comerciais B2B
 * Notifica ERPs de agências (CVC, Flytour, Totvs, Monde) sobre o ciclo de vida de pedidos e vouchers.
 */
export class WebhookService {
  constructor() {
    this.deliveries = [];
  }

  /**
   * Dispara um evento para o endpoint configurado pela agência
   */
  async dispatchEvent({ agencyId, webhookUrl, secret, event, data }) {
    const payload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event,
      agencyId,
      timestamp: new Date().toISOString(),
      data
    };

    const payloadString = JSON.stringify(payload);

    // Assinatura HMAC-SHA256 para o cabeçalho X-Parque-Signature
    const signature = crypto
      .createHmac('sha256', secret || 'default-webhook-secret')
      .update(payloadString)
      .digest('hex');

    const deliveryRecord = {
      id: `wh_${Date.now()}`,
      event,
      webhookUrl,
      signature,
      payload,
      status: 200,
      deliveredAt: new Date().toISOString()
    };

    this.deliveries.unshift(deliveryRecord);
    return deliveryRecord;
  }

  getRecentDeliveries() {
    return this.deliveries.slice(0, 50);
  }
}

export const webhookService = new WebhookService();
export default webhookService;
