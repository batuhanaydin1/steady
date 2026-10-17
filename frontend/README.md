# Steady — frontend

The React + Vite + TypeScript app for **Steady**. It talks to the ASP.NET Core API in
[`../backend/Steady.Api`](../backend/Steady.Api) and ships as static files.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # tsc -b && vite build
```

The API base URL is read from `VITE_API_BASE_URL` (see `.env.example`) and falls back to
`http://localhost:5080`.

Everything else — features, architecture, the database and the full setup steps — is documented
in the [root README](../README.md).
