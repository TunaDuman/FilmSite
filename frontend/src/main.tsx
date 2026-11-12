import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const rawDomain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
const clientId = (import.meta.env.VITE_AUTH0_CLIENT_ID || '').trim();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    cacheLocation="localstorage"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);