import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Suggest() {
  const [movieTitle, setMovieTitle] = useState('');
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const sugData = await api.getSuggestions();
      setSuggestions(sugData.results || []);
    } catch (err: any) {
      console.error('Öneriler çekilemedi:', err.message);
    }

    try {
      const revData = await api.getAllReviews();
      setReviews(revData.results || []);
    } catch (err: any) {
      console.error('Puanlar çekilemedi:', err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      await api.suggestMovie(movieTitle);
      setStatus(`"${movieTitle}" başarıyla servise gönderildi ve kaydedildi!`);
      setMovieTitle('');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Film Öner & Kayıtlı Notlar
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        <div>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#0f172a' }}>Yeni Film Öner</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
              Önermek istediğiniz filmin adını yazıp servise gönderebilirsiniz.
            </p>

            {status && (
              <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                required
                placeholder="Örn: Avengers Doomsday"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                style={{ flex: 1, padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0 20px', backgroundColor: '#eef607', color: '#040303', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
                Servise Gönder
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: '#e69f9f', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '14px', color: '#0f172a' }}>
              Gönderilen Film Önerileri ({suggestions.length})
            </h3>
            {suggestions.length === 0 ? (
              <p style={{ color: '#000000', fontSize: '14px' }}>Henüz film önerisi eklenmemiş.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {suggestions.map((item) => (
                  <li key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                    <strong style={{ color: '#0f172a' }}>🎬 {item.movie_title}</strong>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{item.user_id} • {item.created_at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#4f83d740', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '6px', color: '#0f172a' }}>
            Verilen Puanlar & Notlar ({reviews.length})
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
            Kullanıcıların filmlere verdiği tüm puan ve notların listesi:
          </p>

          {reviews.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Henüz hiçbir filme puan veya not verilmemiş.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Link to={`/movies/${rev.movie_id}`} style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}>
                      Film ID: #{rev.movie_id} (Filme Git →)
                    </Link>
                    <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '13px' }}>
                      ♥ {rev.rating} / 10
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b', marginBottom: '8px', lineHeight: 1.5 }}>
                    {rev.note ? `"${rev.note}"` : <em style={{ color: '#94a3b8' }}>Not bırakılmamış.</em>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Kullanıcı: <strong>{rev.user_id}</strong> • Güncelleme: {rev.updated_at}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}