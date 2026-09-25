import { inventoryService } from '../services/inventoryService.js';

export const getInventory = async (req, res) => {
  try {
    const { date = '2026-09-18' } = req.query;
    const inventory = inventoryService.getInventoryStatus(date);
    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateInventoryQuotas = async (req, res) => {
  try {
    const { date = '2026-09-18', siteQuota, boxOfficeQuota, b2bQuota } = req.body;
    
    if (siteQuota === undefined || boxOfficeQuota === undefined || b2bQuota === undefined) {
      return res.status(400).json({
        success: false,
        error: 'As cotas do site, bilheteria e B2B são obrigatórias.'
      });
    }

    const updated = inventoryService.updateAllocation(date, {
      siteQuota: Number(siteQuota),
      boxOfficeQuota: Number(boxOfficeQuota),
      b2bQuota: Number(b2bQuota)
    });

    res.json({
      success: true,
      message: 'Cotas de inventário redistribuídas com sucesso!',
      data: updated
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
