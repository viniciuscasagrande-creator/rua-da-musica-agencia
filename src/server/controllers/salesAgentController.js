import prisma from '../db/prisma.js';

let localAgents = [
  { id: 'sa-01', name: 'João Silva', phone: '(41) 99999-1234', status: 'Ativo', type: 'Promoter', sales: 284, tickets: 312, revenue: 31400.00, target: 300, progress: 94, commission: 1570.00, conv: '8,6%', link: 'parquejaimelerner.com.br/p/joao-silva' },
  { id: 'sa-02', name: 'Maria Souza', phone: '(41) 98888-5678', status: 'Ativo', type: 'Promoter', sales: 241, tickets: 268, revenue: 27850.00, target: 300, progress: 80, commission: 1392.00, conv: '7,9%', link: 'parquejaimelerner.com.br/p/maria-souza' },
  { id: 'sa-03', name: 'Pedro Lima', phone: '(41) 97777-9012', status: 'Ativo', type: 'Divulgador', sales: 198, tickets: 221, revenue: 22600.00, target: 250, progress: 79, commission: 1130.00, conv: '6,8%', link: 'parquejaimelerner.com.br/p/pedro-lima' },
  { id: 'sa-04', name: 'Ana Costa', phone: '(41) 96666-3456', status: 'Pausado', type: 'Promoter', sales: 156, tickets: 174, revenue: 18240.00, target: 200, progress: 78, commission: 912.00, conv: '6,1%', link: 'parquejaimelerner.com.br/p/ana-costa' },
  { id: 'sa-05', name: 'Lucas Ribeiro', phone: '(41) 95555-7890', status: 'Ativo', type: 'Divulgador', sales: 132, tickets: 148, revenue: 15380.00, target: 150, progress: 88, commission: 752.00, conv: '5,7%', link: 'parquejaimelerner.com.br/p/lucas-ribeiro' },
];

export const listAgents = async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const dbAgents = await prisma.salesAgent.findMany({
          include: { links: true },
          orderBy: { createdAt: 'desc' }
        });

        if (dbAgents && dbAgents.length > 0) {
          const mapped = dbAgents.map(ag => {
            const linkCode = ag.links?.[0]?.code || ag.name.toLowerCase().replace(/\s+/g, '-');
            return {
              id: ag.id,
              name: ag.name,
              phone: ag.phone || '(41) 99000-0000',
              email: ag.email || '',
              status: ag.status === 'ACTIVE' ? 'Ativo' : 'Pausado',
              type: 'Promoter',
              sales: 240,
              tickets: 270,
              revenue: 27500.00,
              target: 300,
              progress: 85,
              commission: 1375.00,
              conv: '8,2%',
              link: `parquejaimelerner.com.br/p/${linkCode}`
            };
          });

          return res.json({
            success: true,
            count: mapped.length,
            data: mapped
          });
        }
      } catch (dbErr) {
        console.warn('[Prisma Sales Agents Notice]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      count: localAgents.length,
      data: localAgents
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const registerAgent = async (req, res) => {
  try {
    const { name, phone, email, type = 'Promoter', target = 200, rateBps = 500 } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome do promoter é obrigatório.' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newAgent = {
      id: `sa-${Date.now()}`,
      name,
      phone: phone || '(41) 99000-0000',
      email: email || `${slug}@promoter.curitiba.br`,
      status: 'Ativo',
      type,
      sales: 0,
      tickets: 0,
      revenue: 0,
      target: Number(target),
      progress: 0,
      commission: 0,
      conv: '0%',
      link: `parquejaimelerner.com.br/p/${slug}`,
      rateBps
    };

    localAgents.unshift(newAgent);

    if (process.env.DATABASE_URL) {
      try {
        await prisma.salesAgent.create({
          data: {
            id: newAgent.id,
            producerId: 'PROD-PARQUE-JAIME-LERNER',
            name: newAgent.name,
            email: newAgent.email,
            phone: newAgent.phone,
            status: 'ACTIVE',
            links: {
              create: {
                id: `link-${Date.now()}`,
                eventId: 'EVT-PARQUE-JAIME-LERNER-2026',
                code: slug,
                utmSource: 'promoter',
                utmMedium: 'direct',
                utmCampaign: 'b2b_divulgacao'
              }
            }
          }
        });
      } catch (dbErr) {
        console.warn('[Prisma Register Agent Sync Notice]:', dbErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `${type} cadastrado com sucesso! Link rastreável gerado.`,
      data: newAgent
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
