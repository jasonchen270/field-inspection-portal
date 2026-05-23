# Field Inspection Reporting Portal

React SPA + .NET Web API for field inspectors to capture site reports offline and sync when reconnected.

## Stack
- **web/**: React 18 + TypeScript + Vite, Dexie (IndexedDB), MSAL for Azure AD, React Router
- **api/**: .NET 10 Web API, EF Core (SQLite), Microsoft.Identity.Web
- **azure-pipelines.yml**: Azure DevOps CI for both projects

## Run locally

```bash
# Terminal 1: API (http://localhost:5000)
cd api/FieldInspection.Api
dotnet run --urls http://localhost:5000

# Terminal 2: Web (http://localhost:5173)
cd web
cp .env.example .env
npm run dev
```

Dev auth is on by default, so you can sign in with any name. No Azure tenant needed.

## Switch to real Azure AD
1. Register an SPA + API app in Azure AD.
2. In `web/.env` set `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`, `VITE_API_SCOPE`.
3. In `api/FieldInspection.Api/appsettings.json` set `AzureAd.Enabled=true` and fill `TenantId` / `ClientId`.

## Offline behavior
- All saves go to IndexedDB first with `syncState: 'pending'`.
- A sync loop runs every 30s, on `online` events, and on manual Sync click. It pushes pending records, then pulls server state.
- Conflict policy: pending local writes win until pushed; otherwise server wins.

See [docs/onboarding.md](./docs/onboarding.md) to get started.
