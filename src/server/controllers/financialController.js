import { commissionEngine } from '../services/commissionEngine.js';

let ledgerEntries = [
  { id: 'LED-8921', date: '2026-09-24', type: 'Crédito Reserva', agency: 'Agência Turismo Brasil', gross: 667.80, fee: 37.80, net: 630.00, status: 'Conciliado' },
  { id: 'LED-8920', date: '2026-09-23', type: 'Crédito Reserva', agency: 'Mundo Brasil Turismo', gross: 1155.40, fee: 65.40, net: 1090.00, status: 'Conciliado' },
  { id: 'LED-8919', date: '2026-09-22', type: 'Crédito Reserva', agency: 'Curitiba Tour', gross: 636.00, fee: 36.00, net: 600.00, status: 'Conciliado' },
  { id: 'LED-8918', date: '2026-09-21', type: 'Estorno Parcial', agency: 'Sul Turismo', gross: -127.20, fee: -7.20, net: -120.00, status: 'Revertido no Ledger' },
  { id: 'LED-8917', date: '2026-09-20', type: 'Repasse Semanal', agency: 'Conta Principal B2B', gross: 42500.00, fee: 0, net: 42500.00, status: 'Liquidado na Conta' },
];

export const getLedgerEntries = async (req, res) => {
  try {
    const totalGross = ledgerEntries.reduce((acc, l) => acc + (l.gross > 0 ? l.gross : 0), 0);
    const totalFees = ledgerEntries.reduce((acc, l) => acc + (l.fee > 0 ? l.fee : 0), 0);
    const totalNet = totalGross - totalFees;

    res.json({
      success: true,
      summary: {
        totalGross: parseFloat(totalGross.toFixed(2)),
        totalFees: parseFloat(totalFees.toFixed(2)),
        totalNet: parseFloat(totalNet.toFixed(2))
      },
      entries: ledgerEntries
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { originalEntryId, agencyName, amount, feeAmount, reason } = req.body;

    if (!originalEntryId || !amount) {
      return res.status(400).json({ success: false, error: 'ID original e valor são obrigatórios.' });
    }

    const reversalEntry = {
      id: `LED-REV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Estorno / Reversão',
      agency: agencyName || 'Agência Credenciada',
      gross: -Math.abs(Number(amount)),
      fee: -Math.abs(Number(feeAmount || (amount * 0.06))),
      net: -Math.abs(Number(amount) - Number(feeAmount || (amount * 0.06))),
      reversesEntryId: originalEntryId,
      reason: reason || 'Cancelamento de reserva solicitado',
      status: 'Revertido no Ledger (Append-Only)'
    };

    ledgerEntries.unshift(reversalEntry);

    res.status(201).json({
      success: true,
      message: 'Reversão contábil registrada com preservação de trilha de auditoria B2B.',
      data: reversalEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
