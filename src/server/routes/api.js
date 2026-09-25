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

export const apiRouter = express.Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'DiskIngressos PDT - B2B & Equipe de Vendas API',
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

// 5. Financeiro & Ledger PDT
apiRouter.get('/b2b/financial/ledger', getLedgerEntries);
apiRouter.post('/b2b/financial/refund', processRefund);

// 6. Equipe de Vendas (Promoters & Divulgadores)
apiRouter.get('/sales-agents', listAgents);
apiRouter.post('/sales-agents', registerAgent);

// 7. Inteligência Artificial (Google Gemini)
apiRouter.post('/ai/assistant', askAiAssistant);

export default apiRouter;
