import prisma from '../db/prisma.js';
import { TICKET_CATALOG, OPERATOR_INFO } from '../../data/mockData.js';

let localCatalog = [...TICKET_CATALOG];
let currentFeePercent = OPERATOR_INFO.defaultFeePercent || 6.0;

export const getPricingCatalog = async (req, res) => {
  try {
    const feeBps = Math.round(currentFeePercent * 100);

    if (process.env.DATABASE_URL) {
      try {
        const dbTiers = await prisma.pricingTier.findMany({
          where: { active: true }
        });
        if (dbTiers && dbTiers.length > 0) {
          const products = dbTiers.map(item => {
            const basePrice = item.basePriceCents / 100;
            const feeAmount = (basePrice * currentFeePercent) / 100;
            return {
              id: item.id,
              name: item.name,
              description: item.name,
              tierType: item.tierType,
              basePrice,
              feePercent: currentFeePercent,
              feeAmount: parseFloat(feeAmount.toFixed(2)),
              finalPrice: parseFloat((basePrice + feeAmount).toFixed(2)),
              minQty: item.minQty,
              icon: item.id.includes('tour') ? 'compass' : (item.id.includes('educativo') ? 'graduation-cap' : (item.id.includes('corp') ? 'briefcase' : 'user')),
              popular: item.id.includes('inteira') || item.id.includes('meia')
            };
          });

          return res.json({
            success: true,
            currentFeePercent,
            feeBps,
            data: products
          });
        }
      } catch (dbErr) {
        console.warn('[Prisma Pricing Catalog Notice]:', dbErr.message);
      }
    }

    const products = localCatalog.map(item => {
      const feeAmount = (item.basePrice * currentFeePercent) / 100;
      return {
        ...item,
        feePercent: currentFeePercent,
        feeAmount: parseFloat(feeAmount.toFixed(2)),
        finalPrice: parseFloat((item.basePrice + feeAmount).toFixed(2))
      };
    });

    res.json({
      success: true,
      currentFeePercent,
      feeBps,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTicketPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { basePrice } = req.body;

    if (!basePrice || isNaN(basePrice)) {
      return res.status(400).json({ success: false, error: 'Preço base inválido.' });
    }

    const ticket = localCatalog.find(t => t.id === id);
    if (ticket) {
      ticket.basePrice = Number(basePrice);
      const fee = (ticket.basePrice * currentFeePercent) / 100;
      ticket.feeAmount = parseFloat(fee.toFixed(2));
      ticket.finalPrice = parseFloat((ticket.basePrice + fee).toFixed(2));
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.pricingTier.update({
          where: { id },
          data: { basePriceCents: Math.round(Number(basePrice) * 100) }
        });
      } catch (dbErr) {
        console.warn('[Prisma Update Price Notice]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: `Preço base do produto atualizado.`,
      data: ticket || { id, basePrice: Number(basePrice) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateGlobalFee = async (req, res) => {
  try {
    const { feePercent } = req.body;
    if (feePercent === undefined || isNaN(feePercent)) {
      return res.status(400).json({ success: false, error: 'Percentual de taxa inválido.' });
    }

    currentFeePercent = Number(feePercent);

    if (process.env.DATABASE_URL) {
      try {
        await prisma.attraction.updateMany({
          data: { defaultFeeBps: Math.round(currentFeePercent * 100) }
        });
        await prisma.pricingTier.updateMany({
          data: { diskFeeBps: Math.round(currentFeePercent * 100) }
        });
      } catch (dbErr) {
        console.warn('[Prisma Update Global Fee Notice]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: `Taxa de Serviço B2B parametrizada para ${currentFeePercent}%.`,
      currentFeePercent
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
