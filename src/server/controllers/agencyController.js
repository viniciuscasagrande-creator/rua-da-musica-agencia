import prisma from '../db/prisma.js';
import { AGENCIES_LIST } from '../../data/mockData.js';

// In-memory backing store for demo/development when DB connection string is pending
let localAgencies = [...AGENCIES_LIST];

export const listAgencies = async (req, res) => {
  try {
    const { search, status, state, page = 1, limit = 10 } = req.query;

    // Try Prisma DB query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const where = {};
        if (status && status !== 'Todos') where.status = status.toUpperCase();
        if (search) {
          where.OR = [
            { legalName: { contains: String(search), mode: 'insensitive' } },
            { document: { contains: String(search) } },
          ];
        }

        const dbAgencies = await prisma.agency.findMany({
          where,
          include: { events: true, links: true, reservations: true },
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit)
        });

        if (dbAgencies.length > 0) {
          return res.json({ success: true, count: dbAgencies.length, data: dbAgencies });
        }
      } catch (dbErr) {
        console.warn('[Prisma Notice] Falling back to memory store:', dbErr.message);
      }
    }

    // Default In-Memory filtered results
    let results = localAgencies.filter(ag => {
      const matchSearch = !search ||
        ag.name.toLowerCase().includes(String(search).toLowerCase()) ||
        ag.city.toLowerCase().includes(String(search).toLowerCase()) ||
        ag.cnpj.includes(String(search));
      const matchStatus = !status || status === 'Todos' || ag.status === status;
      const matchState = !state || state === 'Todos' || ag.state === state;
      return matchSearch && matchStatus && matchState;
    });

    const total = results.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = results.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAgencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = localAgencies.find(a => a.id === id);

    if (!agency) {
      return res.status(404).json({ success: false, error: 'Agência não encontrada' });
    }

    res.json({ success: true, data: agency });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAgency = async (req, res) => {
  try {
    const {
      name,
      legalName,
      cnpj,
      city,
      state = 'PR',
      contactName,
      email,
      phone,
      quotaLimit = 1000,
      paymentTerms = 'Faturamento 15 dias',
      feeBps = 600 // 6%
    } = req.body;

    if (!name || !cnpj) {
      return res.status(400).json({
        success: false,
        error: 'Nome comercial e CNPJ são campos obrigatórios.'
      });
    }

    const newAgency = {
      id: `ag-${Date.now()}`,
      name,
      legalName: legalName || name,
      cnpj,
      city: city || 'Curitiba',
      state,
      location: `${city || 'Curitiba'} - ${state}`,
      status: 'Ativa',
      quotaLimit: Number(quotaLimit),
      quotaUsed: 0,
      reservationsCount: 0,
      ticketsCount: 0,
      revenue: 0,
      diskFeeAmount: 0,
      contactName,
      email,
      phone,
      avatarBg: 'bg-blue-600',
      initials: name.substring(0, 2).toUpperCase(),
      contractDate: new Date().toLocaleDateString('pt-BR'),
      paymentTerms,
      feeBps
    };

    localAgencies.unshift(newAgency);

    // Save to PostgreSQL if connected
    if (process.env.DATABASE_URL) {
      try {
        await prisma.agency.create({
          data: {
            producerId: 'PROD-PARQUE-JAIME-LERNER',
            legalName: newAgency.legalName,
            document: newAgency.cnpj,
            contactName: newAgency.contactName,
            email: newAgency.email,
            status: 'ACTIVE',
            events: {
              create: {
                eventId: 'EVT-PARQUE-JAIME-LERNER-2026',
                feeBps
              }
            }
          }
        });
      } catch (err) {
        console.warn('[Prisma Sync Notice]:', err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Agência credenciada com sucesso!',
      data: newAgency
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAgencyQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotaLimit } = req.body;

    if (!quotaLimit || isNaN(quotaLimit)) {
      return res.status(400).json({ success: false, error: 'Limite de cota inválido.' });
    }

    const agency = localAgencies.find(a => a.id === id);
    if (!agency) {
      return res.status(404).json({ success: false, error: 'Agência não encontrada.' });
    }

    agency.quotaLimit = Number(quotaLimit);

    res.json({
      success: true,
      message: `Cota da agência ${agency.name} atualizada para ${agency.quotaLimit} ingressos.`,
      data: agency
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAgencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Ativa', 'Pendente', 'Suspensa'

    const agency = localAgencies.find(a => a.id === id);
    if (!agency) {
      return res.status(404).json({ success: false, error: 'Agência não encontrada.' });
    }

    agency.status = status;

    res.json({
      success: true,
      message: `Status da agência alterado para ${status}.`,
      data: agency
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
