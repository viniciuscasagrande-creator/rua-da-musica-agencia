import { neon } from '@neondatabase/serverless';
import { getIdentity, mayAccess } from '../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ ok: false, error: 'DATABASE_URL ausente nas variáveis de ambiente' });
  }

  const sql = neon(dbUrl);

  try {
    const user = await getIdentity(req, sql);
    if (!user) return res.status(401).json({ error: 'Login necessário' });
    if (req.method === 'GET') {
      const isAgency = user.role === 'agency';
      const canOperate = mayAccess(user, 'operator');
      const canProduce = mayAccess(user, 'producer');
      const [agenciesRows, reservationsRows, agentsRows, ledgerRows, coreEvents] =
        await Promise.all([
          isAgency ? sql`SELECT * FROM "Agency" WHERE id = ${user.agencyId}` : (canOperate || canProduce ? sql`SELECT * FROM "Agency" ORDER BY "revenue" DESC, "createdAt" DESC` : []),
          isAgency ? sql`SELECT * FROM "GroupReservation" WHERE "agencyId" = ${user.agencyId} ORDER BY "createdAt" DESC` : (canOperate ? sql`SELECT * FROM "GroupReservation" ORDER BY "createdAt" DESC` : []),
          canProduce ? sql`SELECT * FROM "SalesAgent" ORDER BY "revenue" DESC, "createdAt" DESC` : [],
          canProduce ? sql`SELECT * FROM "CommissionEntry" ORDER BY "createdAt" DESC` : [],
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
        reversesEntryId: c.reversesEntryId || null,
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
      const permissions = { create_agency: 'operator', create_reservation: 'agency', checkin_voucher: 'operator', create_sales_agent: 'producer', create_commission_reversal: 'producer' };
      if (!permissions[action]) return res.status(400).json({ error: 'Ação inválida' });
      if (action === 'create_reservation') {
        if (!(mayAccess(user, 'agency') || mayAccess(user, 'operator'))) return res.status(403).json({ error: 'Acesso negado' });
      } else if (!mayAccess(user, permissions[action])) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      const DEFAULT_PRODUCER_ID = '1dd467ed-af6d-401b-a0ed-4d50523ac331';
      const DEFAULT_EVENT_ID = '197bc60b-5b3a-4a29-9c63-c4a24ca9f082';

      if (action === 'create_agency') {
        const id = body.id || `AG-${String(Date.now()).slice(-4)}`;
        const legalName = body.name || 'Nova Agência Turismo';
        const document = body.cnpj || `19.${String(Date.now()).slice(-6, -3)}.104/0001-55`;
        const cityUf = body.cityUf || 'Curitiba - PR';
        const state = (cityUf.split('-')[1] || 'PR').trim();
        const quotaLimit = Number(body.quotaLimit) || 500;
        const contactName = body.contactName || 'Operações B2B';
        const email = body.email || 'contato@agencia.tur.br';

        await sql`
          INSERT INTO "Agency" ("id", "producerId", "legalName", "document", "contactName", "email", "status", "cityUf", "state", "quotaLimit", "bookingsCount", "ticketsSold", "revenue", "packagesCount")
          VALUES (${id}, ${DEFAULT_PRODUCER_ID}, ${legalName}, ${document}, ${contactName}, ${email}, 'ACTIVE', ${cityUf}, ${state}, ${quotaLimit}, 1, 0, 0, 1)
          ON CONFLICT ("id") DO NOTHING
        `;

        await sql`
          INSERT INTO "AgencyEvent" ("id", "agencyId", "eventId", "active", "feeBps")
          VALUES (${`AE-${id}`}, ${id}, ${DEFAULT_EVENT_ID}, true, 600)
          ON CONFLICT DO NOTHING
        `;

        return res.status(201).json({ ok: true, id });
      }

      if (action === 'create_reservation') {
        const b = body.booking || {};
        const id = b.id || `RES-B2B-${String(Date.now()).slice(-4)}`;
        const agencyId = user.role === 'agency' ? user.agencyId : b.agencyId;
        if (!agencyId) return res.status(400).json({ error: 'Agência obrigatória' });
        const agencyRows = await sql`SELECT id, "legalName" FROM "Agency" WHERE id = ${agencyId} AND status = 'ACTIVE' LIMIT 1`;
        if (!agencyRows.length) return res.status(400).json({ error: 'Agência não encontrada ou inativa' });
        const agencyName = agencyRows[0].legalName;
        const agencyEvents = await sql`SELECT id FROM "AgencyEvent" WHERE "agencyId" = ${agencyId} AND active = true LIMIT 1`;
        if (!agencyEvents.length) return res.status(400).json({ error: 'Agência sem evento ativo' });
        const quantity = Math.max(1, Number(b.ticketsCount || 10));
        const baseAmount = Number(b.baseAmount || 0);
        const diskFeeAmount = Number(b.diskFeeAmount || Math.round(baseAmount * 6) / 100);
        const totalAmount = Number(b.totalAmount || baseAmount + diskFeeAmount);
        const itemsJson = JSON.stringify(b.items || []);
        const idempotencyKey = b.idempotencyKey || `IDEMP-${id}-${Date.now()}`;

        await sql`
          INSERT INTO "GroupReservation" (
            "id", "agencyEventId", "agencyId", "agencyName", "ticketTypeId",
            "quantity", "status", "statusLabel", "groupName", "coordinator",
            "visitDate", "visitTime", "baseAmount", "diskFeeAmount", "totalAmount",
            "qrCode", "originCity", "transport", "itemsJson", "idempotencyKey"
          ) VALUES (
            ${id}, ${agencyEvents[0].id}, ${agencyId}, ${agencyName}, 'TKT-INTEIRA',
            ${quantity}, 'CONFIRMED', ${b.status || 'Voucher emitido'}, ${b.groupName}, ${b.coordinator},
            ${b.visitDate}, ${b.visitTime}, ${baseAmount}, ${diskFeeAmount}, ${totalAmount},
            ${b.qrCode || `DISK-${id}-PJL`}, ${b.originCity || 'Curitiba - PR'}, ${b.transport || 'Ônibus Executivo'},
            ${itemsJson}::jsonb, ${idempotencyKey}
          )
          ON CONFLICT ("id") DO NOTHING
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
        const m = body.member || {};
        const id = m.id || `PRM-${String(Date.now()).slice(-4)}`;
        const permissionsJson = JSON.stringify(
          m.permissions || ['Vender ingressos', 'Criar link', 'Utilizar cupom', 'Consultar comissão']
        );

        await sql`
          INSERT INTO "SalesAgent" (
            "id", "producerId", "name", "email", "phone", "document", "pixKey",
            "status", "statusLabel", "role", "initials", "avatarBg",
            "salesCount", "ticketsCount", "revenue", "goalTarget", "goalPct",
            "goalColor", "commission", "commissionPaid", "commissionPending",
            "commissionModel", "conversion", "linkCode", "couponCode",
            "clicks", "sessions", "permissionsJson"
          ) VALUES (
            ${id}, ${DEFAULT_PRODUCER_ID}, ${m.name}, ${m.email}, ${m.phone}, '000.000.000-00', ${m.email},
            'ACTIVE', 'Ativo', ${m.role}, ${m.initials}, ${m.avatarBg || 'bg-blue-600'},
            0, 0, 0, ${Number(m.goalTarget || 200)}, 0,
            'bg-blue-500', 0, 0, 0,
            ${m.commissionModel}, 0, ${m.linkCode}, ${m.couponCode},
            0, 0, ${permissionsJson}::jsonb
          )
          ON CONFLICT ("id") DO NOTHING
        `;

        await sql`
          INSERT INTO "SalesLink" ("id", "eventId", "code", "agentId", "active")
          VALUES (${`SL-${id}`}, ${DEFAULT_EVENT_ID}, ${m.linkCode}, ${id}, true)
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
        if (orig.kind !== 'ACCRUAL') {
          return res.status(400).json({ error: 'Apenas lançamentos ACCRUAL podem ser estornados' });
        }

        const existingReversal = await sql`
          SELECT "id" FROM "CommissionEntry"
          WHERE "reversesEntryId" = ${originalId} AND "kind" = 'REVERSAL'
          LIMIT 1
        `;
        if (existingReversal.length > 0) {
          return res.status(409).json({
            error: 'Este lançamento já possui um estorno (REVERSAL) registrado',
            id: existingReversal[0].id
          });
        }

        const newId = `CE-${String(Date.now()).slice(-5)}`;
        const revAmount = -Math.abs(Number(orig.amount || 0));
        const revCents = -Math.abs(Number(orig.amountCents || Math.round(Math.abs(revAmount) * 100)));
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
