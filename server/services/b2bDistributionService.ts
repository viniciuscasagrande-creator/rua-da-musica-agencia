/**
 * Módulo Distribuição Turística B2B (API Node.js / TypeScript)
 * Regras de negócio integradas ao Prisma (`prisma/schema.prisma`) e ao Estoque/Ledger Único do PDT.
 */

export interface GroupReservationInput {
  agencyId: string;
  agencyEventId: string;
  ticketTypeId: string;
  quantity: number;
  basePriceCents: number;
  feeBps?: number; // Default: 600 (6.0%)
  idempotencyKey: string;
}

export function calculateB2BPricing(basePriceCents: number, feeBps = 600) {
  if (basePriceCents < 0) throw new Error('Preço-base inválido');
  if (feeBps < 0 || feeBps > 5000) throw new Error('Taxa administrativa fora do limite permitido');

  const feeCents = Math.round((basePriceCents * feeBps) / 10000);
  const finalAgencyPriceCents = basePriceCents + feeCents;

  return {
    basePriceCents,
    feeBps,
    feeCents,
    finalAgencyPriceCents
  };
}

export async function createGroupReservationTransaction(
  prisma: any,
  input: GroupReservationInput,
  holdMinutes = 30
) {
  return prisma.$transaction(async (tx: any) => {
    const existing = await tx.groupReservation.findUnique({
      where: { idempotencyKey: input.idempotencyKey }
    });
    if (existing) return existing;

    const agencyEvent = await tx.agencyEvent.findUnique({
      where: { id: input.agencyEventId },
      include: { agency: true }
    });

    if (!agencyEvent || !agencyEvent.active || agencyEvent.agency.status !== 'ACTIVE') {
      throw new Error('Agência ou vínculo com o evento inativo/não autorizado');
    }

    const expiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);

    return tx.groupReservation.create({
      data: {
        agencyEventId: input.agencyEventId,
        agencyId: input.agencyId,
        ticketTypeId: input.ticketTypeId,
        quantity: input.quantity,
        status: 'HELD',
        expiresAt,
        idempotencyKey: input.idempotencyKey
      }
    });
  });
}
