/**
 * Módulo Equipe de Vendas (Promoters & Divulgadores — API Node.js / TypeScript)
 * Atribuição de vendas imutável e livro-razão (Append-Only CommissionEntry) integrado ao Ledger PDT.
 */

export interface CommissionCalculationInput {
  orderAmountCents: number;
  ticketsCount: number;
  rateBps?: number | null;
  fixedCents?: number | null;
}

export function calculateCommissionCents(input: CommissionCalculationInput): number {
  if (input.rateBps != null && input.fixedCents != null) {
    throw new Error('Regra inválida: preencher apenas rateBps OU fixedCents');
  }
  if (input.rateBps != null) {
    return Math.round((input.orderAmountCents * input.rateBps) / 10000);
  }
  if (input.fixedCents != null) {
    return input.fixedCents * input.ticketsCount;
  }
  return 0;
}

/**
 * Registra estorno (REVERSAL) de comissão de forma append-only,
 * preservando o lançamento original (ACCRUAL) para auditoria e rastreabilidade.
 */
export async function reverseCommissionOnRefund(
  prisma: any,
  originalEntryId: string,
  refundEventId: string
) {
  return prisma.$transaction(async (tx: any) => {
    const original = await tx.commissionEntry.findUnique({
      where: { id: originalEntryId }
    });

    if (!original || original.kind !== 'ACCRUAL') {
      throw new Error('Lançamento de comissão original não encontrado ou inválido para estorno');
    }

    return tx.commissionEntry.create({
      data: {
        attributionId: original.attributionId,
        ruleId: original.ruleId,
        kind: 'REVERSAL',
        amountCents: -Math.abs(original.amountCents),
        currency: original.currency,
        sourceEventId: refundEventId,
        reversesEntryId: original.id
      }
    });
  });
}
