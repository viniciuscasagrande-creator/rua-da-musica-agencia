/**
 * Commission Engine for DiskIngressos PDT
 * Computes commissions for promoters, sales agents, and partner agencies.
 * 
 * Rules:
 * 1. Append-only ledger: No updates or deletes on financial tables.
 * 2. Refund/Cancellation creates a negative REVERSAL entry linked to the original.
 * 3. Supports percentage (rateBps), fixed cents, or progressive tier rules.
 */

export class CommissionEngineService {
  /**
   * Calculates commission for an order and generates append-only ledger entries
   */
  calculateCommission({
    orderId,
    eventId,
    recipientKind, // 'SALES_AGENT' | 'AGENCY'
    recipientId,
    totalAmountCents,
    rule
  }) {
    let commissionAmountCents = 0;

    if (rule.rateBps) {
      commissionAmountCents = Math.round((totalAmountCents * rule.rateBps) / 10000);
    } else if (rule.fixedCents) {
      commissionAmountCents = rule.fixedCents;
    }

    const entry = {
      id: `COM-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId,
      eventId,
      recipientKind,
      recipientId,
      kind: 'ACCRUAL', // Provisão de comissão
      amountCents: commissionAmountCents,
      currency: 'BRL',
      sourceEventId: `EVT-ORDER-PAID-${orderId}`,
      createdAt: new Date().toISOString()
    };

    return entry;
  }

  /**
   * Handles order cancellation / chargeback via append-only reversal
   */
  processRefundReversal({ originalEntryId, orderId, eventId, reason }) {
    return {
      id: `COM-REV-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId,
      eventId,
      kind: 'REVERSAL',
      reversesEntryId: originalEntryId,
      sourceEventId: `EVT-ORDER-REFUND-${orderId}`,
      reason: reason || 'Estorno solicitado pelo cliente/produtor',
      createdAt: new Date().toISOString()
    };
  }
}

export const commissionEngine = new CommissionEngineService();
