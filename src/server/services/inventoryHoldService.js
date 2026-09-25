/**
 * Serviço de Reserva Temporária de Estoque (Holding com TTL)
 * Garante bloqueio temporário de vagas para excursões com liberação automática (anti-overselling).
 */

export class InventoryHoldService {
  constructor() {
    this.holds = new Map();
  }

  /**
   * Cria um holding temporário com expiração (TTL)
   */
  createHold({ agencyId, attractionId, visitDate, quantity, ttlMinutes = 480 }) {
    const holdId = `HOLD-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const hold = {
      id: holdId,
      agencyId,
      attractionId,
      visitDate,
      quantity,
      status: 'HELD',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttlMinutes
    };

    this.holds.set(holdId, hold);
    return hold;
  }

  /**
   * Confirma a reserva do holding antes da expiração
   */
  confirmHold(holdId) {
    const hold = this.holds.get(holdId);
    if (!hold) {
      throw new Error(`Holding ${holdId} não encontrado.`);
    }

    if (new Date() > new Date(hold.expiresAt)) {
      hold.status = 'RELEASED_EXPIRED';
      throw new Error(`Holding ${holdId} expirou. Vagas retornaram ao estoque geral.`);
    }

    hold.status = 'CONFIRMED';
    hold.confirmedAt = new Date().toISOString();
    return hold;
  }

  /**
   * Libera automaticamente holdings expirados
   */
  sweepExpiredHolds() {
    const now = new Date();
    const released = [];

    for (const [id, hold] of this.holds.entries()) {
      if (hold.status === 'HELD' && now > new Date(hold.expiresAt)) {
        hold.status = 'RELEASED_EXPIRED';
        hold.releasedAt = now.toISOString();
        released.push(hold);
      }
    }

    return released;
  }
}

export const inventoryHoldService = new InventoryHoldService();
export default inventoryHoldService;
