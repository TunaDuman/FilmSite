import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';

export default function Actors() {
  const [actors, setActors] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActors = async (searchQuery: string = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getActors(searchQuery);
      setActors(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActors(query);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Popüler Oyuncular
          </h1>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
            {actors.length} Oyuncu Listeleniyor
          </span>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Oyuncu adı girin (Boş bırakılırsa 100 popüler oyuncu gelir)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px 0 0 8px', border: '1px solid #cbd5e1', borderRight: 'none', fontSize: '14px', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
            />
          </div>
          <button type="submit" style={{ padding: '0 24px', backgroundColor: '#c423b4', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Oyuncu Ara
          </button>
        </form>
      </div>

      {error && <div style={{ color: '#dc2626', marginBottom: '16px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '15px' }}>Oyuncular yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '20px' }}>
          {actors.map((a) => (
            <div key={a.id} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <img
                src={a.profile_path ? `https://image.tmdb.org/t/p/w500${a.profile_path}` : 'https://via.placeholder.com/300x450?text=Foto+Yok'}
                alt={a.name}
                style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Popülerlik: ♥ {a.popularity?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}