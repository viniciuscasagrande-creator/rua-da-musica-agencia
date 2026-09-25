import prisma from '../db/prisma.js';
import { AGENCIES_LIST } from '../../data/mockData.js';

// In-memory backing store for demo/development fallback
let localAgencies = [...AGENCIES_LIST];

const formatAgency = (ag) => {
  const contract = ag.contracts?.[0] || {};
  const statusMap = {
    ACTIVE: 'Ativa',
    PENDING: 'Pendente',
    SUSPENDED: 'Suspensa',
    BLOCKED_CREDIT: 'Bloqueada'
  };
  const reservations = ag.reservations || [];
  const ticketsCount = reservations.reduce((acc, r) => acc + (r.quantity || 0), 0);
  const revenue = reservations.reduce((acc, r) => acc + ((r.totalAmountCents || 0) / 100), 0);
  const diskFeeAmount = reservations.reduce((acc, r) => acc + ((r.diskFeeAmountCents || 0) / 100), 0);

  return {
    id: ag.id,
    name: ag.tradeName || ag.legalName,
    legalName: ag.legalName,
    cnpj: ag.document,
    document: ag.document,
    city: ag.city || 'Curitiba',
    state: ag.state || 'PR',
    location: `${ag.city || 'Curitiba'} - ${ag.state || 'PR'}`,
    status: statusMap[ag.status] || 'Ativa',
    quotaLimit: (ag.creditLimitCents || 0) > 0 ? Math.round(ag.creditLimitCents / 4000) : 1000,
    quotaUsed: (ag.creditUsedCents || 0) > 0 ? Math.round(ag.creditUsedCents / 4000) : ticketsCount,
    creditLimit: (ag.creditLimitCents || 0) / 100,
    creditUsed: (ag.creditUsedCents || 0) / 100,
    reservationsCount: reservations.length,
    ticketsCount,
    revenue,
    diskFeeAmount,
    contactName: ag.contactName || '',
    email: ag.email || '',
    phone: ag.phone || '',
    avatarBg: 'bg-blue-600',
    initials: (ag.tradeName || ag.legalName).substring(0, 2).toUpperCase(),
    contractDate: new Date(ag.createdAt).toLocaleDateString('pt-BR'),
    paymentTerms: contract.paymentTermsDays ? `Faturamento ${contract.paymentTermsDays} dias` : 'Faturamento 15 dias',
    contracts: ag.contracts || [],
    links: ag.links || []
  };
};

export const listAgencies = async (req, res) => {
  try {
    const { search, status, state, page = 1, limit = 10 } = req.query;

    // Try Prisma DB query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const where = {};
        if (status && status !== 'Todos') {
          const statusReverseMap = {
            'Ativa': 'ACTIVE',
            'Pendente': 'PENDING',
            'Suspensa': 'SUSPENDED',
            'Bloqueada': 'BLOCKED_CREDIT'
          };
          if (statusReverseMap[status]) {
            where.status = statusReverseMap[status];
          }
        }
        if (state && state !== 'Todos') {
          where.state = state;
        }

        const dbAgencies = await prisma.agency.findMany({
          where,
          include: { contracts: true, reservations: true },
          orderBy: { createdAt: 'desc' }
        });

        if (dbAgencies && dbAgencies.length > 0) {
          let formattedList = dbAgencies.map(formatAgency);

          if (search) {
            const q = String(search).toLowerCase();
            formattedList = formattedList.filter(a =>
              a.name.toLowerCase().includes(q) ||
              a.city.toLowerCase().includes(q) ||
              a.cnpj.includes(q)
            );
          }

          const total = formattedList.length;
          const startIndex = (Number(page) - 1) * Number(limit);
          const paginated = formattedList.slice(startIndex, startIndex + Number(limit));

          return res.json({
            success: true,
            total,
            page: Number(page),
            limit: Number(limit),
            data: paginated
          });
        }
      } catch (dbErr) {
        console.warn('[Prisma Agencies Notice] Falling back to memory store:', dbErr.message);
      }
    }

    // Default In-Memory filtered results fallback
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

    if (process.env.DATABASE_URL) {
      try {
        const dbAgency = await prisma.agency.findUnique({
          where: { id },
          include: { contracts: true, reservations: true }
        });
        if (dbAgency) {
          return res.json({ success: true, data: formatAgency(dbAgency) });
        }
      } catch (dbErr) {
        console.warn('[Prisma Get Agency Error]:', dbErr.message);
      }
    }

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

    // Persist to Prisma DB
    if (process.env.DATABASE_URL) {
      try {
        const attraction = await prisma.attraction.findFirst();
        const attractionId = attraction ? attraction.id : 'PRQ-JLERNER-001';

        await prisma.agency.create({
          data: {
            id: newAgency.id,
            producerId: 'PROD-PARQUE-JAIME-LERNER',
            legalName: newAgency.legalName,
            tradeName: newAgency.name,
            document: newAgency.cnpj,
            contactName: newAgency.contactName,
            email: newAgency.email,
            phone: newAgency.phone,
            city: newAgency.city,
            state: newAgency.state,
            status: 'ACTIVE',
            creditLimitCents: newAgency.quotaLimit * 4000,
            contracts: {
              create: {
                attractionId,
                version: 1,
                diskFeeBps: Number(feeBps) || 600,
                agencyCommissionBps: 1000,
                status: 'ACTIVE'
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
    if (agency) {
      agency.quotaLimit = Number(quotaLimit);
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.agency.update({
          where: { id },
          data: { creditLimitCents: Number(quotaLimit) * 4000 }
        });
      } catch (err) {
        console.warn('[Prisma Quota Update]:', err.message);
      }
    }

    res.json({
      success: true,
      message: `Cota da agência atualizada para ${quotaLimit} ingressos.`,
      data: agency || { id, quotaLimit: Number(quotaLimit) }
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
    if (agency) {
      agency.status = status;
    }

    const statusReverseMap = {
      'Ativa': 'ACTIVE',
      'Pendente': 'PENDING',
      'Suspensa': 'SUSPENDED',
      'Bloqueada': 'BLOCKED_CREDIT'
    };

    if (process.env.DATABASE_URL) {
      try {
        await prisma.agency.update({
          where: { id },
          data: { status: statusReverseMap[status] || 'ACTIVE' }
        });
      } catch (err) {
        console.warn('[Prisma Status Update]:', err.message);
      }
    }

    res.json({
      success: true,
      message: `Status da agência alterado para ${status}.`,
      data: agency || { id, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
