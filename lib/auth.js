import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const roles = ['admin', 'operator', 'producer', 'agency'];
export const validRoles = roles;
export function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12) throw new Error('Senha deve conter pelo menos 12 caracteres');
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password, stored) {
  try {
    const [salt, hash] = stored.split(':');
    const candidate = scryptSync(password, salt, 64);
    return timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
  } catch { return false; }
}
const secret = () => {
  const s = process.env.AUTH_SECRET || 'rua-da-musica-pdt-diskingressos-hmac-secret-2026-prod';
  if (s.length < 32) throw new Error('AUTH_SECRET deve ter pelo menos 32 caracteres');
  return s;
};
export function signSession(id) {
  const payload = Buffer.from(JSON.stringify({ id, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
export async function getIdentity(req, sql) {
  const token = (req.headers.authorization || '').match(/^Bearer ([\w-]+\.[\w-]+)$/)?.[1];
  if (!token) return null;
  const [payload, provided] = token.split('.');
  const expected = createHmac('sha256', secret()).update(payload).digest();
  const signature = Buffer.from(provided, 'base64url');
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) return null;
  let claims;
  try { claims = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { return null; }
  if (!claims?.id || !Number.isFinite(claims.exp) || claims.exp <= Date.now()) return null;
  const users = await sql`SELECT id, name, email, role, "agencyId", active FROM "PortalUser" WHERE id = ${claims.id} LIMIT 1`;
  const user = users[0];
  return user?.active ? { id: user.id, name: user.name, email: user.email, role: user.role, agencyId: user.agencyId } : null;
}
export const mayAccess = (user, role) => user?.role === 'admin' || user?.role === role;
