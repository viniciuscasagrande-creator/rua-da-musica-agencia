/**
 * Motor Comercial B2B 2.0 - Core DiskIngressos
 * Gerencia contratos versionados por agência, tarifas escalonadas,
 * limites de crédito faturado e regras comerciais de cancelamento.
 */

export class CommercialEngineService {
  /**
   * Calcula cotação comercial B2B para uma reserva de grupo ou lote de ingressos
   */
  quoteReservation({
    agencyContract, // { diskFeeBps, agencyCommissionBps, paymentTermsDays, creditAvailable }
    tier,           // { publicPrice, agencyB2BPrice, groupPrice15Plus, schoolExcursionPrice }
    tierType,       // 'PUBLIC' | 'AGENCY_B2B' | 'GROUP_15_PLUS' | 'EXCURSION_SCHOOL'
    quantity
  }) {
    let unitBasePrice = tier.agencyB2BPrice || 30.00;

    if (tierType === 'GROUP_15_PLUS' && quantity >= 15) {
      unitBasePrice = tier.groupPrice15Plus || 26.00;
    } else if (tierType === 'EXCURSION_SCHOOL') {
      unitBasePrice = tier.schoolExcursionPrice || 20.00;
    } else if (tierType === 'PUBLIC') {
      unitBasePrice = tier.publicPrice || 40.00;
    }

    // Subtotal base
    const totalBase = unitBasePrice * quantity;

    // Taxa DiskIngressos (padrão 6% / 600 bps)
    const diskFeeBps = agencyContract?.diskFeeBps ?? 600;
    const diskFeeAmount = Math.round((totalBase * diskFeeBps) / 10000 * 100) / 100;

    // Total cobrado da agência
    const totalAmount = totalBase + diskFeeAmount;

    // Comissão repassada à agência
    const agencyCommissionBps = agencyContract?.agencyCommissionBps ?? 1000;
    const commissionAmount = Math.round((totalBase * agencyCommissionBps) / 10000 * 100) / 100;

    // Repasse líquido retido pelo Parque Jaime Lerner
    const netParkAmount = totalBase;

    // Verificação de Limite de Crédito Faturado
    const isCreditEligible = (agencyContract?.paymentTermsDays ?? 0) > 0;
    const creditAvailable = agencyContract?.creditAvailable ?? 0;
    const creditApproved = !isCreditEligible || (creditAvailable >= totalAmount);

    return {
      quantity,
      unitBasePrice,
      totalBase,
      diskFeeBps,
      diskFeeAmount,
      totalAmount,
      agencyCommissionBps,
      commissionAmount,
      netParkAmount,
      paymentTermsDays: agencyContract?.paymentTermsDays ?? 0,
      creditApproved,
      creditAvailable,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Avalia política de cancelamento conforme a janela horária do contrato
   */
  evaluateCancellation({ contract, visitDate, requestDate = new Date() }) {
    const visit = new Date(visitDate);
    const diffHours = (visit.getTime() - requestDate.getTime()) / (1000 * 60 * 60);

    const allowedWindow = contract?.cancellationWindowHours ?? 48;
    const isPenaltyFree = diffHours >= allowedWindow;

    return {
      isPenaltyFree,
      diffHours: Math.max(0, Math.round(diffHours)),
      allowedWindow,
      penaltyPercent: isPenaltyFree ? 0 : 20, // 20% multa por cancelamento tardio
      reason: isPenaltyFree
        ? 'Cancelamento dentro da janela contratual sem multa.'
        : `Cancelamento fora da janela (${allowedWindow}h). Sujeito a retenção administrativa.`
    };
  }
}

export const commercialEngine = new CommercialEngineService();
export default commercialEngine;
