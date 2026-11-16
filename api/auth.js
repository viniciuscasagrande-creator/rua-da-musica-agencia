import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'node:crypto';
import { getIdentity, hashPassword, signSession, validRoles, verifyPassword } from '../lib/auth.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Método não permitido' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'Banco não configurado' });
  const sql = neon(process.env.DATABASE_URL);
  try {
    if (req.method === 'GET') {
      const user = await getIdentity(req, sql);
      return user ? res.json({ user }) : res.status(401).json({ error: 'Sessão inválida' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (body.action === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      const users = await sql`SELECT * FROM "PortalUser" WHERE email = ${email} AND active = true LIMIT 1`;
      const found = users[0];
      if (!found || !verifyPassword(body.password || '', found.passwordHash)) return res.status(401).json({ error: 'Credenciais inválidas' });
      const user = { id: found.id, name: found.name, email: found.email, role: found.role, agencyId: found.agencyId };
      return res.json({ token: signSession(found.id), user });
    }
    if (body.action === 'create_user') {
      const admin = await getIdentity(req, sql);
      if (admin?.role !== 'admin') return res.status(403).json({ error: 'Somente o administrador pode cadastrar usuários' });
      const role = String(body.role || '');
      const agencyId = role === 'agency' ? String(body.agencyId || '') : null;
      const email = String(body.email || '').trim().toLowerCase();
      const name = String(body.name || '').trim();
      if (!validRoles.includes(role) || !email.includes('@') || !name || (role === 'agency' && !agencyId)) return res.status(400).json({ error: 'Dados de usuário inválidos' });
      if (agencyId) {
        const agency = await sql`SELECT id FROM "Agency" WHERE id = ${agencyId} LIMIT 1`;
        if (!agency.length) return res.status(400).json({ error: 'Agência não encontrada' });
      }
      const passwordHash = hashPassword(body.password);
      const id = randomUUID();
      await sql`INSERT INTO "PortalUser" (id, name, email, "passwordHash", role, "agencyId") VALUES (${id}, ${name}, ${email}, ${passwordHash}, ${role}, ${agencyId})`;
      return res.status(201).json({ ok: true, id });
    }
    if (body.action === 'list_users') {
      const admin = await getIdentity(req, sql);
      if (admin?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
      const users = await sql`SELECT id, name, email, role, "agencyId", active FROM "PortalUser" ORDER BY "createdAt" DESC`;
      return res.json({ users });
    }
    return res.status(400).json({ error: 'Ação inválida' });
  } catch (e) {
    console.error('Auth error', e);
    return res.status(500).json({ error: 'Falha de autenticação ou tabela ainda não migrada' });
  }
}
