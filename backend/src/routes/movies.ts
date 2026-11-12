import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { getMovies, getMovieById } from '../services/tmdb';

const movies = new Hono<{ Bindings: Bindings; Variables: Variables }>();

movies.use('*', async (c, next) => {
  const user = c.get('user');
  if (user.role === 'actor_only') {
    return c.json({ error: 'Bu alana erişim yetkiniz yok.' }, 403);
  }
  await next();
});

movies.get('/', async (c) => {
  try {
    const query = c.req.query('query');
    const page = c.req.query('page') ? Number(c.req.query('page')) : undefined;
    const data = await getMovies(c.env.TMDB_API_KEY, query, page);
    return c.json({ results: data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

movies.get('/suggestions', async (c) => {
  try {
    const user = c.get('user');

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS movie_suggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        movie_title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const { results } = await c.env.DB.prepare(
      'SELECT id, user_id, movie_title, created_at FROM movie_suggestions WHERE user_id = ? ORDER BY id DESC'
    ).bind(user.id).all();

    return c.json({ results: results || [] });
  } catch (err: any) {
    return c.json({ error: err.message || 'Oneriler alinamadi.' }, 500);
  }
});

movies.post('/suggest', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const movieTitle = body.movieTitle?.trim();

    if (!movieTitle) {
      return c.json({ error: 'Film adi bos olamaz.' }, 400);
    }
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS movie_suggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        movie_title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await c.env.DB.prepare(
      'INSERT INTO movie_suggestions (user_id, movie_title) VALUES (?, ?)'
    ).bind(user.id, movieTitle).run();

    return c.json({ success: true, message: 'Film onerisi kaydedildi.' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Film onerisi kaydedilirken hata olustu.' }, 500);
  }
});

movies.get('/reviews', async (c) => {
  try {
    const user = c.get('user');

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS movie_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
        note TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(movie_id, user_id)
      )
    `).run();

    const { results } = await c.env.DB.prepare(
      'SELECT id, movie_id, user_id, rating, note, updated_at FROM movie_reviews WHERE user_id = ? ORDER BY id DESC'
    ).bind(user.id).all();

    return c.json({ results: results || [] });
  } catch (err: any) {
    return c.json({ error: err.message || 'Notlar alinamadi.' }, 500);
  }
});

movies.get('/:id', async (c) => {
  try {
    const movieId = Number(c.req.param('id'));
    if (isNaN(movieId)) {
      return c.json({ error: 'Gecersiz film ID formati.' }, 400);
    }

    const user = c.get('user');
    const movie = await getMovieById(c.env.TMDB_API_KEY, movieId);
    let totalVotes = 0;
    let averageRating = 0;
    let userReview = null;

    try {
      const stats = await c.env.DB.prepare(
        'SELECT COUNT(*) as totalVotes, AVG(rating) as avgRating FROM movie_reviews WHERE movie_id = ?'
      ).bind(movieId).first<{ totalVotes: number; avgRating: number | null }>();

      totalVotes = stats?.totalVotes || 0;
      averageRating = stats?.avgRating ? Number(Number(stats.avgRating).toFixed(1)) : 0;

      userReview = await c.env.DB.prepare(
        'SELECT rating, note, updated_at FROM movie_reviews WHERE movie_id = ? AND user_id = ?'
      ).bind(movieId, user.id).first();
    } catch (dbErr) {
      console.error('DB okuma hatasi:', dbErr);
    }

    return c.json({
      movie,
      stats: {
        totalVotes,
        averageRating,
      },
      userReview: userReview || null,
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Film getirilemedi.' }, 500);
  }
});

movies.post('/:id/review', async (c) => {
  try {
    const movieId = Number(c.req.param('id'));
    const user = c.get('user');
    const body = await c.req.json();
    const rating = Number(body.rating);
    const note = body.note?.trim() || '';

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return c.json({ error: 'Puan 1 ile 10 arasinda bir tam sayi olmalidir.' }, 400);
    }

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS movie_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
        note TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(movie_id, user_id)
      )
    `).run();

    const existing = await c.env.DB.prepare(
      'SELECT id FROM movie_reviews WHERE movie_id = ? AND user_id = ?'
    ).bind(movieId, user.id).first<{ id: number }>();

    if (existing) {
      await c.env.DB.prepare(
        'UPDATE movie_reviews SET rating = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(rating, note, existing.id).run();
    } else {
      await c.env.DB.prepare(
        'INSERT INTO movie_reviews (movie_id, user_id, rating, note) VALUES (?, ?, ?, ?)'
      ).bind(movieId, user.id, rating, note).run();
    }

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Kayit sirasinda sunucu hatasi olustu.' }, 500);
  }
});

export default movies;