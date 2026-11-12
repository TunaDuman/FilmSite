import { Hono } from 'hono';
import { getActors } from '../services/tmdb';
import { AuthUser, requireRole } from '../middlewares/auth';

type Bindings = {
  TMDB_API_KEY: string;
};

const actors = new Hono<{ Bindings: Bindings; Variables: { user: AuthUser } }>();

actors.use('*', requireRole(['actor_only', 'both']));

actors.get('/', async (c) => {
  const query = c.req.query('query');
  const data = await getActors(c.env.TMDB_API_KEY, query);
  return c.json({ results: data });
});

export default actors;