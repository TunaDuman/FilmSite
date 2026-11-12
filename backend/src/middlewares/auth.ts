import { Context, Next } from 'hono';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Bindings, Variables, UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

const ROLE_BY_EMAIL: Record<string, UserRole> = {
  'user1@proje.com': 'movie_only',
  'user2@proje.com': 'actor_only',
  'user3@proje.com': 'both',
};

export async function authMiddleware(
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Yetkilendirme tokeni bulunamadi.' }, 401);
  }

  const token = authHeader.split(' ')[1].trim();

  try {
    const rawDomain = c.env.AUTH0_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!rawDomain) {
      return c.json({ error: 'Backend .dev.vars icinde AUTH0_DOMAIN tanimli degil.' }, 500);
    }

    const JWKS = createRemoteJWKSet(new URL(`https://${rawDomain}/.well-known/jwks.json`));

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://${rawDomain}/`,
    });

    const email =
      (payload.email as string) ||
      (payload[`https://${rawDomain}/email`] as string) ||
      (payload.sub as string);

    const role: UserRole = ROLE_BY_EMAIL[email] || 'both';

    c.set('user', {
      id: (payload.sub as string) || email,
      email,
      role,
    });

    await next();
  } catch (err: any) {
    return c.json({ error: `Auth0 Token Hatasi: ${err.message}` }, 401);
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => {
    const user = c.get('user');
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: 'Bu alana erisim yetkiniz yok.' }, 403);
    }
    await next();
  };
}