import { NavLink } from 'react-router-dom';
import { Film, Users, Send, LogOut } from 'lucide-react';

interface SidebarProps {
  user: { id: string; email: string; role: 'movie_only' | 'actor_only' | 'both' };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const canSeeMovies = user.role === 'movie_only' || user.role === 'both';
  const canSeeActors = user.role === 'actor_only' || user.role === 'both';

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#eb8f0f' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    marginBottom: '8px',
    fontSize: '14px',
  });

  return (
    <aside style={{ width: '250px', flexShrink: 0, backgroundColor: '#0f172a', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', position: 'sticky', top: 0 }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '14px', color: '#38bdf8', paddingLeft: '8px' }}>
          🎬 TMDB Portal
        </h2>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', lineHeight: 1.6, textAlign: 'left' }}>
          <div>Giriş: <strong style={{ color: '#fff' }}>{user.email}</strong></div>
          <div>Yetki: <strong style={{ color: '#38bdf8' }}>{user.role}</strong></div>
        </div>

        <nav>
          {canSeeMovies && (
            <NavLink to="/movies" style={linkStyle}>
              <Film size={18} /> Popüler Film Listele
            </NavLink>
          )}

          {canSeeActors && (
            <NavLink to="/actors" style={linkStyle}>
              <Users size={18} /> Popüler Oyuncu Listele
            </NavLink>
          )}

          {canSeeMovies && (
            <NavLink to="/suggest" style={linkStyle}>
              <Send size={18} /> Film Öner & Notlar
            </NavLink>
          )}
        </nav>
      </div>

      <button
        onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '100%', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
      >
        <LogOut size={18} /> Çıkış Yap
      </button>
    </aside>
  );
}