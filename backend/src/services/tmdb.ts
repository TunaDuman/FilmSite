export const MAX_ITEMS = 100;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchUpToMax(endpoint: string, apiKey: string, extraParams: string = '') {
  const pagesToFetch = Math.ceil(MAX_ITEMS / 20);
  const allResults: any[] = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    const sep = extraParams ? '&' : '';
    const url = `${TMDB_BASE_URL}${endpoint}?language=tr-TR&page=${page}${sep}${extraParams}`;
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        Accept: 'application/json',
        'User-Agent': 'TMDB-Portal-Worker/1.0'
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`TMDB Hatasi (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as any;
    if (data.results && data.results.length > 0) {
      allResults.push(...data.results);
    } else {
      break;
    }
  }

  return allResults.slice(0, MAX_ITEMS);
}

export async function getMovies(apiKey: string, query?: string, page?: number) {
  if (page) {
    const endpoint = query ? `/search/movie` : `/movie/popular`;
    const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?language=tr-TR&page=${page}${queryParam}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    });
    return await res.json();
  }

  if (query && query.trim() !== '') {
    return await fetchUpToMax('/search/movie', apiKey, `query=${encodeURIComponent(query)}`);
  }
  return await fetchUpToMax('/movie/popular', apiKey);
}

export async function getMovieById(apiKey: string, id: number) {
  const url = `${TMDB_BASE_URL}/movie/${id}?language=tr-TR`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      Accept: 'application/json',
      'User-Agent': 'TMDB-Portal-Worker/1.0',
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TMDB Detay Hatasi (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function getActors(apiKey: string, query?: string) {
  if (query && query.trim() !== '') {
    return await fetchUpToMax('/search/person', apiKey, `query=${encodeURIComponent(query)}`);
  }
  return await fetchUpToMax('/person/popular', apiKey);
}