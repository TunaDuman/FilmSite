import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [rating, setRating] = useState<number>(10);
  const [note, setNote] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadMovie = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getMovieById(id);
      setData(res);
      if (res.userReview) {
        setRating(res.userReview.rating);
        setNote(res.userReview.note || '');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setMessage('');
    try {
      await api.addReview(id, Number(rating), note);
      setMessage('Puan ve notunuz başarıyla kaydedildi!');
      loadMovie();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p style={{ color: '#64748b' }}>Film bilgileri yükleniyor...</p>;
  if (!data?.movie) return <p style={{ color: '#dc2626' }}>Film bulunamadı.</p>;

  const { movie, stats, userReview } = data;

  return (
    <div style={{ maxWidth: '960px', textAlign: 'left' }}>
      <button
        onClick={() => navigate('/movies')}
        style={{ marginBottom: '20px', padding: '9px 16px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#0f172a', fontWeight: 600, fontSize: '14px' }}
      >
        ← Filmlere Dön
      </button>

      <div style={{ display: 'flex', gap: '28px', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: '24px', flexWrap: 'wrap' }}>
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
          alt={movie.title}
          style={{ width: '220px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
              ID: {movie.id}
            </span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>TMDB Puanı: ♥ {movie.vote_average?.toFixed(1)}</span>
          </div>

          <h1 style={{ fontSize: '26px', marginBottom: '12px', color: '#0f172a' }}>{movie.title}</h1>
          <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '15px', marginBottom: '24px' }}>
            {movie.overview || 'Bu film için Türkçe özet bulunmuyor.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Portal Ortalama Puanı</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>
                ♥ {stats.averageRating} / 10 <span style={{ fontSize: '13px', fontWeight: 400, color: '#64748b' }}>({stats.totalVotes} oy)</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '200px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>Senin Verdiğin Puan</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#1d4ed8' }}>
                {userReview ? `♥ ${userReview.rating} / 10` : 'Henüz puan vermedin'}
              </div>
              {userReview?.note && (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#1e3a8a', backgroundColor: '#dbeafe', padding: '8px 10px', borderRadius: '6px' }}>
                  <strong>Notun:</strong> "{userReview.note}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#0f172a' }}>Filme Puan ve Not Ekle / Güncelle</h3>
        {message && (
          <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
            Puanınız (1 - 10 Arası Tam Sayı):
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ padding: '10px 14px', width: '140px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '15px', fontWeight: 600 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>{num} Puan</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
            Film Hakkındaki Notunuz:
          </label>
          <textarea
            rows={4}
            placeholder="Film hakkındaki düşüncelerinizi veya notlarınızı buraya yazın..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <button type="submit" style={{ padding: '12px 28px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          Puan ve Notu Kaydet
        </button>
      </form>
    </div>
  );
}