const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

let authToken: string | null = localStorage.getItem('portal_token');

export function setToken(token: string) {
  authToken = token;
  localStorage.setItem('portal_token', token);
}

export function clearToken() {
  authToken = null;
  localStorage.removeItem('portal_token');
}

export function getToken(): string | null {
  return authToken || localStorage.getItem('portal_token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Sunucu Hatası (${res.status}): ${text}`);
  }

  if (!res.ok) {
    throw new Error(data.error || 'Bir hata oluştu');
  }
  return data;
}

export const api = {
  getMe: () => request('/api/me'),
  getMovies: (query: string = '') => request(`/api/movies${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  getMovieById: (id: string) => request(`/api/movies/${id}`),
  addReview: (id: string, rating: number, note: string) =>
    request(`/api/movies/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, note }),
    }),
  suggestMovie: (movieTitle: string) =>
    request('/api/movies/suggest', {
      method: 'POST',
      body: JSON.stringify({ movieTitle }),
    }),
  getSuggestions: () => request('/api/movies/suggestions'),
  getAllReviews: () => request('/api/movies/reviews'),
  getActors: (query: string = '') => request(`/api/actors${query ? `?query=${encodeURIComponent(query)}` : ''}`),
};