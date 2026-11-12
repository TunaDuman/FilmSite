import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { api, setToken, clearToken } from './services/api';
import Sidebar from './components/Sidebar';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Actors from './pages/Actors';
import Suggest from './pages/Suggest';

export default function App() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getIdTokenClaims,
    user: auth0User,
    error: auth0Error,
  } = useAuth0();

  const [portalUser, setPortalUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [authError, setAuthError] = useState('');

  const configuredDomain = import.meta.env.VITE_AUTH0_DOMAIN;
  const configuredClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  useEffect(() => {
    const syncAuth = async () => {
      if (!isAuthenticated) {
        setPortalUser(null);
        return;
      }

      setLoadingUser(true);
      setAuthError('');
      try {
        const claims = await getIdTokenClaims();
        const token = claims?.__raw || '';

        if (!token) {
          throw new Error('Auth0 JWT token alinamadi.');
        }

        setToken(token);
        const res = await api.getMe();
        setPortalUser(res.user);
      } catch (err: any) {
        setAuthError(err.message || 'Kullanıcı bilgileri doğrulanamadı.');
      } finally {
        setLoadingUser(false);
      }
    };

    syncAuth();
  }, [isAuthenticated, getIdTokenClaims, auth0User]);

  const handleLogout = () => {
    clearToken();
    setPortalUser(null);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isLoading || loadingUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#fff' }}>
        <h3>Auth0 oturumu kontrol ediliyor...</h3>
      </div>
    );
  }

  if (!isAuthenticated || !portalUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#fff' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '36px', borderRadius: '12px', width: '420px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '12px' }}>🎬 TMDB Portal (Auth0)</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>
            Devam etmek için Auth0 güvenli giriş ekranı üzerinden oturum açın.
          </p>

          {(!configuredDomain || !configuredClientId) && (
            <div style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'left' }}>
              <strong>Uyarı:</strong> <code>frontend/.env.local</code> içinde Domain veya Client ID okunamadı. Lütfen frontend terminalini kapatıp tekrar <code>npm run dev</code> yapın.
            </div>
          )}

          {(auth0Error || authError) && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              {auth0Error?.message || authError}
            </div>
          )}

          <button
            onClick={() => loginWithRedirect()}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}
          >
            Auth0 ile Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const defaultRoute = portalUser.role === 'actor_only' ? '/actors' : '/movies';

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <Sidebar user={portalUser} onLogout={handleLogout} />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/suggest" element={<Suggest />} />
            <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}