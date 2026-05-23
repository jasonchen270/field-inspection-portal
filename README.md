# Field Inspection Reporting Portal

A portal for field inspectors to capture site reports offline and sync them when reconnected. The web client is a React 18 + TypeScript + Vite SPA using Dexie (IndexedDB) for offline storage, MSAL for Azure AD auth, and React Router, and the API is a .NET 10 Web API on EF Core (SQLite) with Microsoft.Identity.Web.

## Prerequisites

- .NET 10 SDK
- Node 20+

## Installation

```bash
# API
cd api/FieldInspection.Api

# Web
cd web
cp .env.example .env
npm install
```

## Usage

```bash
# Terminal 1: API (http://localhost:5000)
cd api/FieldInspection.Api
dotnet run --urls http://localhost:5000

# Terminal 2: Web (http://localhost:5173)
cd web
npm run dev
```

Dev auth is on by default, so you can sign in with any name. No Azure tenant needed.
