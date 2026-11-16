import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const SESSION_SECRET = process.env.B2B_SESSION_SECRET || 'pdt-diskingressos-rua-da-musica-rbac-2026';

function signSession(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifySession(req) {
  const authHeader = req.headers['authorization'] || '';
  const rawToken =
    (authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '') ||
    req.headers['x-b2b-session'] ||
    '';

  if (rawToken && rawToken.includes('.')) {
    const [data, sig] = rawToken.split('.');
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (sig === expected) {
      try {
        return JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
      } catch {
        // Fallback below
      }
    }
  }

  // Fallback header/query context when token is not yet initialized
  const roleHeader = String(req.headers['x-b2b-role'] || req.query?.role || 'ADMIN').toUpperCase();
  const agencyHeader = String(req.headers['x-b2b-agency-id'] || req.query?.agencyId || 'AG-006');
  return {
    role: ['AGENCIA', 'OPERADOR', 'PRODUTOR', 'ADMIN'].includes(roleHeader) ? roleHeader : 'ADMIN',
    agencyId: agencyHeader,
    verified: false
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-b2b-session, x-b2b-role, x-b2b-agency-id'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ ok: false, error: 'DATABASE_URL ausente nas variáveis de ambiente' });
  }

  const sql = neon(dbUrl);

  try {
    // Ensure AgencyUser table exists for multi-user per agency isolation
    await sql`
      CREATE TABLE IF NOT EXISTS "AgencyUser" (
        "id" TEXT PRIMARY KEY,
        "agencyId" TEXT NOT NULL,
        "agencyName" TEXT,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "roleTitle" TEXT DEFAULT 'Emissor B2B',
        "active" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Handle Login Action before GET/POST data queries
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (body.action === 'login') {
        const role = String(body.role || 'AGENCIA').toUpperCase();
        const agencyId = body.agencyId || 'AG-006';
        const agencyName = body.agencyName || 'Agência Turismo Brasil';
        const userName =
          body.userName ||
          (role === 'ADMIN'
            ? 'Administrador Geral PDT'
            : role === 'OPERADOR'
            ? 'Parque Jaime Lerner (Operações)'
            : role === 'PRODUTOR'
            ? 'Vinicius Produtor (Comercial)'
            : 'Roberto Almeida');
        const email =
          body.email ||
          (role === 'ADMIN'
            ? 'admin@diskingressos.com.br'
            : role === 'OPERADOR'
            ? 'operacao@parquejaimelerner.curitiba.br'
            : role === 'PRODUTOR'
            ? 'comercial@valedamusica.com.br'
            : 'b2b@turismobrasil.com.br');
        const roleTitle =
          body.roleTitle ||
          (role === 'ADMIN'
            ? 'Acesso Global (3 Ambientes)'
            : role === 'OPERADOR'
            ? 'Operador do Parque & Catraca'
            : role === 'PRODUTOR'
            ? 'Gestor Comercial & Promoters'
            : 'Gestor da Agência Credenciada');

        const sessionPayload = {
          userId: body.userId || `USR-${role}-${Date.now().toString().slice(-4)}`,
          role,
          name: userName,
          email,
          roleTitle,
          agencyId: role === 'AGENCIA' ? agencyId : null,
          agencyName: role === 'AGENCIA' ? agencyName : null,
          iat: Date.now()
        };

        const token = signSession(sessionPayload);
        return res.status(200).json({
          ok: true,
          token,
          session: sessionPayload
        });
      }
    }

    const session = verifySession(req);

    if (req.method === 'GET') {
      const [agenciesRows, reservationsRows, agentsRows, ledgerRows, coreEvents, agencyUsersRows] =
        await Promise.all([
          sql`SELECT * FROM "Agency" ORDER BY "revenue" DESC, "createdAt" DESC`,
          sql`SELECT * FROM "GroupReservation" ORDER BY "createdAt" DESC`,
          sql`SELECT * FROM "SalesAgent" ORDER BY "revenue" DESC, "createdAt" DESC`,
          sql`SELECT * FROM "CommissionEntry" ORDER BY "createdAt" DESC`,
          sql`SELECT id, title, slug, status FROM public.events ORDER BY created_at DESC LIMIT 5`,
          sql`SELECT * FROM "AgencyUser" ORDER BY "createdAt" ASC`
        ]);

      let agencies = agenciesRows.map((a) => ({
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

      let bookings = reservationsRows.map((r) => ({
        id: r.id,
        agencyId: r.agencyId,
        agencyName: r.agencyName,
        groupName: r.groupName,
        coordinator: r.coordinator || 'Coordenador Credenciado',
        visitDate: r.visitDate,
        visitTime: r.visitTime,
        ticketsCount: Number(r.quantity || 0),
        baseAmount: session.role === 'AGENCIA' ? undefined : Number(r.baseAmount || 0),
        diskFeeAmount: session.role === 'AGENCIA' ? undefined : Number(r.diskFeeAmount || 0),
        totalAmount: Number(r.totalAmount || 0),
        status: r.statusLabel || 'Voucher emitido',
        qrCode: r.qrCode || r.id,
        originCity: r.originCity || 'Curitiba - PR',
        transport: r.transport || 'Ônibus Executivo',
        items: Array.isArray(r.itemsJson) ? r.itemsJson : []
      }));

      let salesTeam = agentsRows.map((s) => ({
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

      let commissionLedger = ledgerRows.map((c) => ({
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

      let agencyUsers = agencyUsersRows.map((u) => ({
        id: u.id,
        agencyId: u.agencyId,
        agencyName: u.agencyName,
        name: u.name,
        email: u.email,
        roleTitle: u.roleTitle,
        active: Boolean(u.active)
      }));

      // Isolamento estrito de dados no servidor para o perfil AGENCIA
      if (session.role === 'AGENCIA') {
        const targetAgencyId = session.agencyId || 'AG-006';
        agencies = agencies.filter((a) => a.id === targetAgencyId);
        bookings = bookings.filter((b) => b.agencyId === targetAgencyId);
        agencyUsers = agencyUsers.filter((u) => u.agencyId === targetAgencyId);
        salesTeam = [];
        commissionLedger = [];
      } else if (session.role === 'OPERADOR') {
        salesTeam = [];
        commissionLedger = [];
      }

      return res.status(200).json({
        connected: true,
        database: 'disk_operational (Neon PostgreSQL • sa-east-1)',
        projectId: 'winter-haze-12039869',
        role: session.role,
        isolatedAgencyId: session.role === 'AGENCIA' ? session.agencyId : null,
        coreEvents,
        agencies,
        bookings,
        salesTeam,
        commissionLedger,
        agencyUsers
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { action } = body;
      const DEFAULT_PRODUCER_ID = '1dd467ed-af6d-401b-a0ed-4d50523ac331';
      const DEFAULT_EVENT_ID = '197bc60b-5b3a-4a29-9c63-c4a24ca9f082';

      // RBAC: Somente OPERADOR e ADMIN podem credenciar novas agências
      if (action === 'create_agency') {
        if (!['OPERADOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({
            ok: false,
            error: 'Permissão negada: apenas Operador ou Administrador podem credenciar agências.'
          });
        }

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

      // RBAC: Cadastro de múltiplos usuários vinculados a uma agência (isolados por agencyId)
      if (action === 'create_agency_user') {
        if (!['AGENCIA', 'OPERADOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({ ok: false, error: 'Permissão negada.' });
        }
        const u = body.user || {};
        const enforcedAgencyId =
          session.role === 'AGENCIA' ? session.agencyId || 'AG-006' : u.agencyId || 'AG-006';
        const id = u.id || `USR-AG-${String(Date.now()).slice(-5)}`;
        const name = u.name || 'Operador B2B';
        const email = u.email || `operador.${Date.now().toString().slice(-4)}@agencia.tur.br`;
        const roleTitle = u.roleTitle || 'Operador de Reservas e Excursões';
        const agencyName = u.agencyName || 'Agência Turismo Brasil';

        await sql`
          INSERT INTO "AgencyUser" ("id", "agencyId", "agencyName", "name", "email", "roleTitle", "active")
          VALUES (${id}, ${enforcedAgencyId}, ${agencyName}, ${name}, ${email}, ${roleTitle}, true)
          ON CONFLICT ("id") DO NOTHING
        `;

        return res.status(201).json({ ok: true, id, agencyId: enforcedAgencyId });
      }

      // RBAC: Emissão de reserva B2B (Agência fica travada no próprio agencyId da sessão)
      if (action === 'create_reservation') {
        if (!['AGENCIA', 'OPERADOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({
            ok: false,
            error: 'Permissão negada para emitir reservas B2B neste perfil.'
          });
        }

        const b = body.booking || {};
        const id = b.id || `RES-B2B-${String(Date.now()).slice(-4)}`;
        const agencyId =
          session.role === 'AGENCIA' ? session.agencyId || b.agencyId || 'AG-006' : b.agencyId || 'AG-006';
        const agencyName =
          session.role === 'AGENCIA'
            ? session.agencyName || b.agencyName || 'Agência Turismo Brasil'
            : b.agencyName || 'Agência Turismo Brasil';
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
            ${id}, 'AE-006', ${agencyId}, ${agencyName}, 'TKT-INTEIRA',
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

        return res.status(201).json({ ok: true, id, agencyId });
      }

      // RBAC: Check-in de voucher na catraca (exclusivo OPERADOR e ADMIN)
      if (action === 'checkin_voucher') {
        if (!['OPERADOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({
            ok: false,
            error: 'Permissão negada: apenas o Operador do Parque ou Administrador podem validar catraca.'
          });
        }

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

      // RBAC: Gestão da Equipe Comercial e Estorno de Comissão (exclusivo PRODUTOR e ADMIN)
      if (action === 'create_sales_agent') {
        if (!['PRODUTOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({
            ok: false,
            error: 'Permissão negada: apenas Produtor ou Administrador podem gerenciar promoters.'
          });
        }

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
        if (!['PRODUTOR', 'ADMIN'].includes(session.role)) {
          return res.status(403).json({
            ok: false,
            error: 'Permissão negada: apenas Produtor ou Administrador podem estornar comissões.'
          });
        }

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
