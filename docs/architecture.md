# Architecture

```
┌─────────────────────────┐      ┌────────────────────────┐
│  React SPA (web/)       │      │  .NET API (api/)       │
│                         │      │                        │
│  ┌──────────────────┐   │      │  ┌──────────────────┐  │
│  │ Pages / Editor   │   │      │  │ ReportsController│  │
│  └────────┬─────────┘   │      │  └────────┬─────────┘  │
│           │             │      │           │            │
│  ┌────────▼─────────┐   │      │  ┌────────▼─────────┐  │
│  │ Dexie (IndexedDB)│   │      │  │ EF Core / SQLite │  │
│  └────────┬─────────┘   │      │  └──────────────────┘  │
│           │             │      │           ▲            │
│  ┌────────▼─────────┐   │ HTTPS│           │            │
│  │ sync.ts          │───┼──────┼───Bearer──┘            │
│  └──────────────────┘   │      │                        │
│  ┌──────────────────┐   │      │  ┌──────────────────┐  │
│  │ MSAL / Dev auth  │   │      │  │ Identity.Web /   │  │
│  └──────────────────┘   │      │  │ Dev auth handler │  │
└─────────────────────────┘      └────────────────────────┘
```

## Key files
- `web/src/db/db.ts`: Dexie schema; one table `reports` keyed by UUID
- `web/src/db/sync.ts`: push pending then pull remote loop
- `web/src/auth/auth.ts`: toggles between dev login and MSAL based on env
- `api/.../Program.cs`: toggles between dev auth and Identity.Web based on `AzureAd:Enabled`
- `api/.../Controllers/ReportsController.cs`: CRUD plus upsert by id

## Data model
A report has: `id`, `siteName`, `inspectorName`, `inspectedAt`, `status`, `notes`, `photoDataUrl`. Client adds `syncState` ('pending' | 'synced').

## Auth flow
- **Dev mode (default):** client sends `Authorization: Bearer dev-<name>`. `DevAuthHandler` accepts any such token and creates a `ClaimsPrincipal` with that name.
- **Azure AD:** MSAL acquires a token for the API scope; `AddMicrosoftIdentityWebApi` validates it.

## Offline / sync
- Writes always hit IndexedDB first → instant, works offline.
- Sync triggers: page load, `online` event, 30s interval, manual button.
- Push: every record where `syncState=pending` is POSTed; on 200, flipped to `synced`.
- Pull: GET `/api/reports`, write any record whose local copy is `synced` (don't clobber pending edits).
