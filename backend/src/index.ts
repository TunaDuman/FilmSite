import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware, AuthUser } from './middlewares/auth';
import movies from './routes/movies';
import actors from './routes/actors';

const app = new Hono<{ Variables: { user: AuthUser } }>();

app.use('*', cors());
app.get('/', (c) => c.json({ status: 'calısıyo' }));

app.use('/api/*', authMiddleware);

app.get('/api/me', (c) => {
  return c.json({ user: c.get('user') });
});

app.route('/api/movies', movies);
app.route('/api/actors', actors);

export default app;