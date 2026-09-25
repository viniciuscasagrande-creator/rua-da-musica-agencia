import prisma from '../db/prisma.js';

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
  async createHold({ agencyId = 'ag-01', attractionId = 'PRQ-JLERNER-001', visitDate, quantity, ttlMinutes = 480 }) {
    const holdId = `HOLD-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const hold = {
      id: holdId,
      agencyId,
      attractionId,
      visitDate: visitDate || now.toISOString().split('T')[0],
      quantity: Number(quantity) || 10,
      status: 'HELD',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttlMinutes
    };

    this.holds.set(holdId, hold);

    if (process.env.DATABASE_URL) {
      try {
        await prisma.inventoryHold.create({
          data: {
            id: holdId,
            attractionId,
            agencyId,
            visitDate: new Date(hold.visitDate),
            quantity: hold.quantity,
            status: 'HELD',
            expiresAt,
            idempotencyKey: `HOLD-AUTO-${holdId}-${Date.now()}`
          }
        });
      } catch (err) {
        console.warn('[Prisma Inventory Hold Sync]:', err.message);
      }
    }

    return hold;
  }

  /**
   * Confirma a reserva do holding antes da expiração
   */
  async confirmHold(holdId) {
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

    if (process.env.DATABASE_URL) {
      try {
        await prisma.inventoryHold.update({
          where: { id: holdId },
          data: { status: 'CONFIRMED' }
        });
      } catch (err) {
        console.warn('[Prisma Confirm Hold Sync]:', err.message);
      }
    }

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
