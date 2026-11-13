import { neon } from '@neondatabase/serverless';

const DEFAULT_DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://disk:npg_W7aEi2XjFAZz@ep-polished-dew-b6duonq6-pooler.c-2.sa-east-1.aws.neon.tech/disk_operational?sslmode=require';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = neon(DEFAULT_DB_URL);

  try {
    if (req.method === 'GET') {
      const [agenciesRows, reservationsRows, agentsRows, ledgerRows, coreEvents] =
        await Promise.all([
          sql`SELECT * FROM "Agency" ORDER BY "revenue" DESC, "createdAt" DESC`,
          sql`SELECT * FROM "GroupReservation" ORDER BY "createdAt" DESC`,
          sql`SELECT * FROM "SalesAgent" ORDER BY "revenue" DESC, "createdAt" DESC`,
          sql`SELECT * FROM "CommissionEntry" ORDER BY "createdAt" DESC`,
          sql`SELECT id, title, slug, status FROM public.events ORDER BY created_at DESC LIMIT 5`
        ]);

      const agencies = agenciesRows.map((a) => ({
        id: a.id,
        name: a.legalName,
        cnpj: a.document,
        cityUf: a.cityUf || 'Curitiba - PR',
        state: a.state || 'PR',
        status: a.status === 'ACTIVE' ? 'Ativa' : a.status === 'PENDING' ? 'Pendente' : 'Suspensa',
        quotaLimit: Number(a.quotaLimit || 500),
        bookingsCount: Number(a.bookingsCount || 0),
        ticketsSold: Number(a.ticketsSold || 0),
        revenue: Number(a.revenue || 0),
        packagesCount: Number(a.packagesCount || 1),
        contactName: a.contactName || 'Operações B2B',
        email: a.email || ''
      }));

      const bookings = reservationsRows.map((r) => ({
        id: r.id,
        agencyId: r.agencyId,
        agencyName: r.agencyName,
        groupName: r.groupName,
        coordinator: r.coordinator || 'Coordenador Credenciado',
        visitDate: r.visitDate,
        visitTime: r.visitTime,
        ticketsCount: Number(r.quantity || 0),
        baseAmount: Number(r.baseAmount || 0),
        diskFeeAmount: Number(r.diskFeeAmount || 0),
        totalAmount: Number(r.totalAmount || 0),
        status: r.statusLabel || 'Voucher emitido',
        qrCode: r.qrCode || r.id,
        originCity: r.originCity || 'Curitiba - PR',
        transport: r.transport || 'Ônibus Executivo',
        items: Array.isArray(r.itemsJson) ? r.itemsJson : []
      }));

      const salesTeam = agentsRows.map((s) => ({
        id: s.id,
        initials: s.initials || 'PR',
        avatarBg: s.avatarBg || 'bg-blue-600',
        name: s.name,
        phone: s.phone || '(41) 99999-0000',
        email: s.email || '',
        document: s.document || '',
        pixKey: s.pixKey || s.email || '',
        status: s.statusLabel || (s.status === 'ACTIVE' ? 'Ativo' : 'Pausado'),
        role: s.role || 'Promoter',
        salesCount: Number(s.salesCount || 0),
        ticketsCount: Number(s.ticketsCount || 0),
        revenue: Number(s.revenue || 0),
        goalTarget: Number(s.goalTarget || 200),
        goalPct: Number(s.goalPct || 0),
        goalColor: s.goalColor || 'bg-blue-500',
        commission: Number(s.commission || 0),
        commissionPaid: Number(s.commissionPaid || 0),
        commissionPending: Number(s.commissionPending || 0),
        commissionModel: s.commissionModel || 'Percentual (5%)',
        conversion: Number(s.conversion || 0),
        linkCode: s.linkCode,
        couponCode: s.couponCode,
        clicks: Number(s.clicks || 0),
        sessions: Number(s.sessions || 0),
        permissions: Array.isArray(s.permissionsJson) ? s.permissionsJson : []
      }));

      const commissionLedger = ledgerRows.map((c) => ({
        id: c.id,
        orderId: c.orderId,
        promoterName: c.promoterName,
        kind: c.kind,
        label: c.label,
        ticketType: c.ticketType,
        amount: Number(c.amount || 0),
        status: c.status,
        createdAt: c.createdAtText
      }));

      return res.status(200).json({
        connected: true,
        database: 'disk_operational (Neon PostgreSQL • sa-east-1)',
        projectId: 'winter-haze-12039869',
        coreEvents,
        agencies,
        bookings,
        salesTeam,
        commissionLedger
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { action } = body;

      if (action === 'create_agency') {
        const id = `AG-${String(Math.floor(100 + Math.random() * 899))}`;
        const legalName = body.name || 'Nova Agência Turismo';
        const document = body.cnpj || '19.882.104/0001-55';
        const cityUf = body.cityUf || 'Curitiba - PR';
        const state = (cityUf.split('-')[1] || 'PR').trim();
        const quotaLimit = Number(body.quotaLimit) || 500;
        const contactName = body.contactName || 'Operações B2B';
        const email = body.email || 'contato@agencia.tur.br';

        await sql`
          INSERT INTO "Agency" ("id", "legalName", "document", "contactName", "email", "status", "cityUf", "state", "quotaLimit", "bookingsCount", "ticketsSold", "revenue", "packagesCount")
          VALUES (${id}, ${legalName}, ${document}, ${contactName}, ${email}, 'ACTIVE', ${cityUf}, ${state}, ${quotaLimit}, 1, 0, 0, 1)
        `;

        await sql`
          INSERT INTO "AgencyEvent" ("id", "agencyId", "active", "feeBps")
          VALUES (${`AE-${id}`}, ${id}, true, 600)
          ON CONFLICT DO NOTHING
        `;

        return res.status(201).json({ ok: true, id });
      }

      if (action === 'create_reservation') {
        const b = body.booking;
        const id = b.id || `RES-B2B-${Math.floor(1050 + Math.random() * 8900)}`;
        const agencyId = b.agencyId || 'AG-006';
        const agencyName = b.agencyName || 'Agência Turismo Brasil';
        const quantity = Number(b.ticketsCount || 10);
        const baseAmount = Number(b.baseAmount || 0);
        const diskFeeAmount = Number(b.diskFeeAmount || 0);
        const totalAmount = Number(b.totalAmount || 0);
        const itemsJson = JSON.stringify(b.items || []);
        const idempotencyKey = `IDEMP-${id}-${Date.now()}`;

        await sql`
          INSERT INTO "GroupReservation" (
            "id", "agencyEventId", "agencyId", "agencyName", "ticketTypeId",
            "quantity", "status", "statusLabel", "groupName", "coordinator",
            "visitDate", "visitTime", "baseAmount", "diskFeeAmount", "totalAmount",
            "qrCode", "originCity", "transport", "itemsJson", "idempotencyKey"
          ) VALUES (
            ${id}, 'AE-006', ${agencyId}, ${agencyName}, 'TKT-INTEIRA',
            ${quantity}, 'CONFIRMED', ${b.status || 'Voucher emitido'}, ${b.groupName}, ${b.coordinator},
            ${b.visitDate}, ${b.visitTime}, ${baseAmount}, ${diskFeeAmount}, ${totalAmount},
            ${b.qrCode || `DISK-${id}-PJL`}, ${b.originCity || 'Curitiba - PR'}, ${b.transport || 'Ônibus Executivo'},
            ${itemsJson}::jsonb, ${idempotencyKey}
          )
        `;

        await sql`
          UPDATE "Agency"
          SET "bookingsCount" = "bookingsCount" + 1,
              "ticketsSold" = "ticketsSold" + ${quantity},
              "revenue" = "revenue" + ${totalAmount},
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = ${agencyId}
        `;

        return res.status(201).json({ ok: true, id });
      }

      if (action === 'checkin_voucher') {
        const { bookingId, checkedIn } = body;
        const newStatusLabel = checkedIn ? 'Concluído' : 'Voucher emitido';
        await sql`
          UPDATE "GroupReservation"
          SET "statusLabel" = ${newStatusLabel},
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = ${bookingId}
        `;
        return res.status(200).json({ ok: true, bookingId, status: newStatusLabel });
      }

      if (action === 'create_sales_agent') {
        const m = body.member;
        const id = m.id || `PRM-${Math.floor(10 + Math.random() * 89)}`;
        const permissionsJson = JSON.stringify(
          m.permissions || ['Vender ingressos', 'Criar link', 'Utilizar cupom', 'Consultar comissão']
        );

        await sql`
          INSERT INTO "SalesAgent" (
            "id", "name", "email", "phone", "document", "pixKey",
            "status", "statusLabel", "role", "initials", "avatarBg",
            "salesCount", "ticketsCount", "revenue", "goalTarget", "goalPct",
            "goalColor", "commission", "commissionPaid", "commissionPending",
            "commissionModel", "conversion", "linkCode", "couponCode",
            "clicks", "sessions", "permissionsJson"
          ) VALUES (
            ${id}, ${m.name}, ${m.email}, ${m.phone}, '000.000.000-00', ${m.email},
            'ACTIVE', 'Ativo', ${m.role}, ${m.initials}, ${m.avatarBg || 'bg-blue-600'},
            0, 0, 0, ${Number(m.goalTarget || 200)}, 0,
            'bg-blue-500', 0, 0, 0,
            ${m.commissionModel}, 0, ${m.linkCode}, ${m.couponCode},
            0, 0, ${permissionsJson}::jsonb
          )
        `;

        await sql`
          INSERT INTO "SalesLink" ("id", "code", "agentId", "active")
          VALUES (${`SL-${id}`}, ${m.linkCode}, ${id}, true)
          ON CONFLICT DO NOTHING
        `;

        return res.status(201).json({ ok: true, id });
      }

      if (action === 'create_commission_reversal') {
        const { originalId } = body;
        const rows = await sql`SELECT * FROM "CommissionEntry" WHERE "id" = ${originalId} LIMIT 1`;
        if (!rows.length) {
          return res.status(404).json({ error: 'Lançamento original não encontrado' });
        }
        const orig = rows[0];
        const newId = `CE-${Math.floor(9905 + Math.random() * 900)}`;
        const revAmount = -Math.abs(Number(orig.amount || 0));
        const revCents = -Math.abs(Number(orig.amountCents || 0));
        const nowStr = new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        await sql`
          INSERT INTO "CommissionEntry" (
            "id", "attributionId", "ruleId", "orderId", "promoterName",
            "kind", "label", "ticketType", "amountCents", "amount",
            "currency", "status", "sourceEventId", "reversesEntryId", "createdAtText"
          ) VALUES (
            ${newId}, ${orig.attributionId}, ${orig.ruleId}, ${orig.orderId}, ${orig.promoterName},
            'REVERSAL', ${`ESTORNO DE PEDIDO (Reversão Append-Only ref. ${orig.id})`},
            ${`${orig.ticketType} (Estornado)`}, ${revCents}, ${revAmount},
            'BRL', 'Revertido', ${`EVT-REV-${newId}`}, ${orig.id}, ${nowStr}
          )
        `;

        return res.status(201).json({ ok: true, id: newId });
      }

      return res.status(400).json({ error: 'Ação inválida' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Neon DB Error:', error);
    return res.status(500).json({
      connected: false,
      error: error.message
    });
  }
}
