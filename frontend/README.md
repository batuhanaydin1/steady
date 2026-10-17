# Steady — frontend

**Steady** için React + Vite + TypeScript uygulaması.
[`../backend/Steady.Api`](../backend/Steady.Api) içindeki ASP.NET Core API'siyle konuşur ve statik
dosyalar olarak yayınlanır.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # tsc -b && vite build
```

API temel adresi `VITE_API_BASE_URL` üzerinden okunur (`.env.example` dosyasına bak) ve bulamazsa
`http://localhost:5080` adresine düşer.

Geri kalan her şey — özellikler, mimari, veritabanı ve tüm kurulum adımları —
[kök README](../README.md) dosyasında belgelenmiştir.
