import { TICKET_CATALOG, OPERATOR_INFO } from '../../data/mockData.js';

let localCatalog = [...TICKET_CATALOG];
let currentFeePercent = OPERATOR_INFO.defaultFeePercent || 6.0;

export const getPricingCatalog = async (req, res) => {
  try {
    const feeBps = Math.round(currentFeePercent * 100);

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
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ingresso não encontrado.' });
    }

    ticket.basePrice = Number(basePrice);
    const fee = (ticket.basePrice * currentFeePercent) / 100;
    ticket.feeAmount = parseFloat(fee.toFixed(2));
    ticket.finalPrice = parseFloat((ticket.basePrice + fee).toFixed(2));

    res.json({
      success: true,
      message: `Preço base do produto ${ticket.name} atualizado.`,
      data: ticket
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

    res.json({
      success: true,
      message: `Taxa de Serviço B2B parametrizada para ${currentFeePercent}%.`,
      currentFeePercent
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
