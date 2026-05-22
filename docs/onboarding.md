# Intern onboarding

## Day 1 setup
1. Install: Node 20+, .NET 10 SDK, an editor (VS Code recommended).
2. Clone and run both servers (see `README.md`).
3. Open http://localhost:5173, sign in with any name, create a test report.
4. Verify in DevTools → Application → IndexedDB → `field-inspection` that the record is there.
5. Click **Sync**, then check the API: `curl -H "Authorization: Bearer dev-yourname" http://localhost:5000/api/reports`.

## Where to make changes
| Want to... | Edit... |
|---|---|
| Add a new field to a report | `web/src/db/db.ts` (interface + bump Dexie version), `api/.../Models/InspectionReport.cs`, then update `ReportEditor.tsx` and the controller upsert |
| Change auth | `web/src/auth/auth.ts` (client) and `api/.../Program.cs` (server) |
| Add a new page | New file in `web/src/pages/`, register route in `App.tsx` |
| Add a new endpoint | New action in `Controllers/ReportsController.cs` (or a new controller) |
| Tweak CI | `azure-pipelines.yml` |

## Conventions
- IDs are UUIDs generated client-side (`crypto.randomUUID()`); the API treats POST as upsert by id.
- Never bypass the Dexie layer. All reads/writes go through `db.reports`.
- Every save sets `syncState: 'pending'`; only the sync engine sets `'synced'`.

## Common gotchas
- **CORS errors:** the API's allowed origin is `http://localhost:5173`. If you change the web port, update `Program.cs`.
- **EF schema changes:** delete `reports.db` during dev (the API auto-creates on startup). For prod use `dotnet ef migrations`.
- **Dexie version bumps:** if you change `db.ts` schema, bump the `version(N)` number or existing browsers will throw.
- **Photos as data URLs:** simple but bloats IndexedDB. For large rollouts, switch to `Blob` storage or a separate object store.
