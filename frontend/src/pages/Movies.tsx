import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Hash } from 'lucide-react';
import { api } from '../services/api';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [movieIdInput, setMovieIdInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMovies = async (searchQuery: string = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMovies(searchQuery);
      setMovies(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovies(query);
  };

  const handleIdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieIdInput.trim()) return;
    navigate(`/movies/${movieIdInput.trim()}`);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Popüler Filmler
          </h1>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
            {movies.length} Film Listeleniyor
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 2, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Film arayın"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px 0 0 8px', border: '1px solid #cbd5e1', borderRight: 'none', fontSize: '14px', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ padding: '0 22px', backgroundColor: '#51a83b', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
              İsimle Ara
            </button>
          </form>
          <form onSubmit={handleIdSearch} style={{ display: 'flex', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Hash size={17} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <input
                type="number"
                placeholder="Film ID (Örn: 550)"
                value={movieIdInput}
                onChange={(e) => setMovieIdInput(e.target.value)}
                style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: '8px 0 0 8px', border: '1px solid #cbd5e1', borderRight: 'none', fontSize: '14px', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ padding: '0 18px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
              ID ile Getir
            </button>
          </form>
        </div>
      </div>

      {error && <div style={{ color: '#dc2626', marginBottom: '16px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '15px' }}>Filmler yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '20px' }}>
          {movies.map((m) => (
            <Link
              key={m.id}
              to={`/movies/${m.id}`}
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/300x450?text=Afis+Yok'}
                  alt={m.title}
                  style={{ width: '100%', height: '275px', objectFit: 'cover', display: 'block' }}
                />
                <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(15, 23, 42, 0.88)', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                  ID: {m.id}
                </span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.title}>
                  {m.title}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                  TMDB Puanı: ⭐ {m.vote_average?.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}