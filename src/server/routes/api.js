import express from 'express';
import {
  listAgencies,
  getAgencyById,
  createAgency,
  updateAgencyQuota,
  updateAgencyStatus
} from '../controllers/agencyController.js';
import {
  listReservations,
  createReservation,
  cancelReservation
} from '../controllers/reservationController.js';
import { validateVoucher } from '../controllers/voucherController.js';
import {
  getPricingCatalog,
  updateTicketPrice,
  updateGlobalFee
} from '../controllers/pricingController.js';
import {
  getLedgerEntries,
  processRefund
} from '../controllers/financialController.js';
import {
  listAgents,
  registerAgent
} from '../controllers/salesAgentController.js';
import {
  getInventory,
  updateInventoryQuotas
} from '../controllers/inventoryController.js';
import { askAiAssistant } from '../controllers/aiController.js';
import { commercialEngine } from '../services/commercialEngine.js';
import { inventoryHoldService } from '../services/inventoryHoldService.js';
import { webhookService } from '../services/webhookService.js';
import { COMMERCIAL_CONTRACTS, TIERED_PRICING_CATALOG } from '../../data/mockData.js';

export const apiRouter = express.Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Parque Jaime Lerner - B2B & Equipe de Vendas API',
    timestamp: new Date().toISOString()
  });
});

// 1. Agências B2B (Parceiras)
apiRouter.get('/b2b/agencies', listAgencies);
apiRouter.post('/b2b/agencies', createAgency);
apiRouter.get('/b2b/agencies/:id', getAgencyById);
apiRouter.patch('/b2b/agencies/:id/quota', updateAgencyQuota);
apiRouter.patch('/b2b/agencies/:id/status', updateAgencyStatus);

// 2. Reservas de Grupos B2B
apiRouter.get('/b2b/reservations', listReservations);
apiRouter.post('/b2b/reservations', createReservation);
apiRouter.post('/b2b/reservations/:id/cancel', cancelReservation);

// 3. Vouchers & Validação de Catraca
apiRouter.post('/b2b/vouchers/validate', validateVoucher);

// 4. Tarifário & Taxas B2B
apiRouter.get('/b2b/pricing', getPricingCatalog);
apiRouter.put('/b2b/pricing/global-fee', updateGlobalFee);
apiRouter.put('/b2b/pricing/:id', updateTicketPrice);

// 5. Inventário Central & Cotas
apiRouter.get('/b2b/inventory/status', getInventory);
apiRouter.put('/b2b/inventory/allocation', updateInventoryQuotas);

// 5. Financeiro & Ledger B2B
apiRouter.get('/b2b/financial/ledger', getLedgerEntries);
apiRouter.post('/b2b/financial/refund', processRefund);

// 6. Equipe de Vendas (Promoters & Divulgadores)
apiRouter.get('/sales-agents', listAgents);
apiRouter.post('/sales-agents', registerAgent);

// 7. Motor Comercial B2B 2.0 & Tarifário Escalável
apiRouter.get('/b2b/contracts', (req, res) => {
  res.json({ success: true, data: COMMERCIAL_CONTRACTS });
});

apiRouter.post('/b2b/quote', (req, res) => {
  const { agencyId, tierId, tierType, quantity } = req.body;
  const contract = COMMERCIAL_CONTRACTS.find(c => c.agencyId === agencyId) || COMMERCIAL_CONTRACTS[0];
  const tier = TIERED_PRICING_CATALOG.find(t => t.id === tierId) || TIERED_PRICING_CATALOG[0];

  const quotation = commercialEngine.quoteReservation({
    agencyContract: {
      diskFeeBps: Math.round(contract.diskFeePercent * 100),
      agencyCommissionBps: Math.round(contract.agencyCommissionPercent * 100),
      paymentTermsDays: contract.paymentTermsDays,
      creditAvailable: contract.creditAvailable
    },
    tier,
    tierType: tierType || 'AGENCY_B2B',
    quantity: Number(quantity) || 1
  });

  res.json({ success: true, data: quotation });
});

// 8. Reservas Temporárias de Estoque (Holds com TTL)
apiRouter.post('/b2b/holds', async (req, res) => {
  const { agencyId, attractionId, visitDate, quantity, ttlMinutes } = req.body;
  const hold = await inventoryHoldService.createHold({
    agencyId: agencyId || 'ag-01',
    attractionId: attractionId || 'PRQ-JLERNER-001',
    visitDate: visitDate || '2026-09-30',
    quantity: Number(quantity) || 10,
    ttlMinutes: Number(ttlMinutes) || 480
  });

  res.json({ success: true, data: hold });
});

apiRouter.post('/b2b/holds/:id/confirm', async (req, res) => {
  try {
    const confirmed = await inventoryHoldService.confirmHold(req.params.id);
    res.json({ success: true, data: confirmed });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Webhooks & Notificações Assíncronas
apiRouter.post('/b2b/webhooks/dispatch', async (req, res) => {
  const { agencyId, webhookUrl, event, data } = req.body;
  const delivery = await webhookService.dispatchEvent({
    agencyId: agencyId || 'ag-01',
    webhookUrl: webhookUrl || 'https://erp.agenciaturismo.com.br/webhooks/parquejaimelerner',
    event: event || 'reserva.confirmada',
    data: data || { test: true }
  });

  res.json({ success: true, data: delivery });
});

apiRouter.get('/b2b/webhooks/logs', (req, res) => {
  res.json({ success: true, data: webhookService.getRecentDeliveries() });
});

// 10. Inteligência Artificial (Google Gemini)
apiRouter.post('/ai/assistant', askAiAssistant);

export default apiRouter;
