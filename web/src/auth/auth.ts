import { PublicClientApplication, type Configuration } from '@azure/msal-browser';

export const useDevAuth = !import.meta.env.VITE_AZURE_CLIENT_ID;

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID ?? 'common'}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'localStorage' },
};

export const msalInstance = new PublicClientApplication(msalConfig);
const apiScope = import.meta.env.VITE_API_SCOPE ?? 'api://field-inspection/access';

export async function getToken(): Promise<string> {
  if (useDevAuth) {
    const name = localStorage.getItem('dev-user') ?? 'inspector';
    return `dev-${name}`;
  }
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error('Not signed in');
  const result = await msalInstance.acquireTokenSilent({ scopes: [apiScope], account });
  return result.accessToken;
}

export async function signIn(): Promise<string> {
  if (useDevAuth) {
    const name = prompt('Dev login - your name:', 'inspector') ?? 'inspector';
    localStorage.setItem('dev-user', name);
    return name;
  }
  const result = await msalInstance.loginPopup({ scopes: [apiScope] });
  return result.account?.username ?? 'user';
}

export function signOut() {
  if (useDevAuth) localStorage.removeItem('dev-user');
  else msalInstance.logoutPopup();
}

export function currentUser(): string | null {
  if (useDevAuth) return localStorage.getItem('dev-user');
  return msalInstance.getAllAccounts()[0]?.username ?? null;
}
