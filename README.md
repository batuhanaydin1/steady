# Steady

> **İstikrarı kur. Her seferinde bir oturum.**

Steady, günlük kullanım için bir odak zamanlayıcısı ve görev yönetimi web uygulamasıdır: bir
görev seç, bir odak oturumu çalıştır ve günlük ve haftalık istikrarının nasıl biriktiğini izle.

Gerçek bir arka uç, gerçek bir veritabanı ve gerçekten çalışan bir özellik kümesiyle
profesyonel bir portföy projesi olarak geliştirilmiştir — statik bir maket değildir.

---

## Durum

| Aşama | Kapsam | Durum |
| ----- | ------ | ----- |
| 1 | Proje temeli: React frontend iskeleti + `/api/health` içeren ASP.NET Core API | ✅ Tamam |
| 2 | Tasarım sistemi ve uygulama düzeni (kabuk, gezinme, tema, arayüz bileşenleri) | ✅ Tamam |
| 3 | Odak zamanlayıcısı (odak / mola, hazır süreler, bildirimler, dairesel ilerleme) | ✅ Tamam |
| 4 | PostgreSQL + EF Core migration'ları + Görevler API'si | ✅ Tamam |
| 5 | Görev yönetimi arayüzü | ✅ Tamam |
| 6 | Oturum kaydı ve geçmiş | ✅ Tamam |
| 7 | İstatistik panosu ve grafikler | ✅ Tamam |
| 8 | PostgreSQL'de saklanan zamanlayıcı tercihleri | ✅ Tamam |
| 9 | Cila, erişilebilirlik ve duyarlılık testleri | ✅ Tamam |
| 10 | Dokümantasyon ve son gözden geçirme | ✅ Tamam |

---

## Özellikler

**Şu anda hazır**

- **Odak zamanlayıcısı** — 1–120 dk odak ve 1–30 dk mola, hazır süreler (30/45/60/90),
  başlat / duraklat / devam et / sıfırla, mod değiştirme, dairesel ilerleme, sesli ve görsel uyarı
  ve arka plandaki bir sekmede ya da sayfa yenilendikten sonra da doğru kalan bir geri sayım.
- **Görevler** — doğrulama, filtreler ve RFC 9457 hata yanıtları içeren, PostgreSQL destekli gerçek
  bir CRUD API'si üzerinden görev oluşturma, tamamlama, yeniden açma, düzenleme, filtreleme ve silme.
- **Göreve bağlı odak** — üzerinde çalıştığın görevi Odak ekranından seç ya da bir satırdan
  doğrudan ona atla; zamanlayıcı bu seçimi yeniden yüklemelerden sonra da korur.
- **Oturum geçmişi** — tamamlanan her odak oturumu, bağlı olduğu görevle birlikte veritabanına
  kaydedilir, Odak ekranında listelenir ve İstatistik'te güne göre gruplanır. Kaydedilemeyen bir
  oturum asla sessizce kaybolmaz: sen tekrar deneyene kadar ekranda kalır.
- **İstatistikler** — bugünün odak süresi ve oturum sayısı, bu haftanın toplamları ve yedi günlük
  çubuk grafik; hepsi kayıtlı oturumlardan hesaplanır. Bugünün rakamları ayrıca Odak ekranında da
  bulunur, böylece sayılar zaten bulunduğun yerdedir.
- **Seninle gelen tercihler** — odak ve mola süreleri ile uyarı anahtarları yalnızca tek bir cihazda
  değil, PostgreSQL'de saklanır. Zamanlayıcı önbellekteki kopyayı anında okur, böylece API
  kapalıyken de çalışır; API'nin kabul edemediği bir değişiklik kaybolmak yerine cihazda tutulur ve
  sonra gönderilir.
- **Her ekranda rahat** — elle yazılmış tek bir token sistemi koyu ve açık temayı, 320px'lik bir
  telefondan geniş bir masaüstüne kadar ayakta kalan bir düzeni ve akıcı animasyonları yönetir.
  Her şeye klavyeden ulaşılabilir ve odak halkası görünürdür; pencereler odağı hapseder ve geri
  verir, dokunma hedefleri 24px minimumunun üzerinde kalır ve `prefers-reduced-motion` döngüsel
  animasyonları kapatır.

---

## Teknolojiler

| Katman | Seçim |
| ------ | ----- |
| Frontend | React 19 + Vite + TypeScript |
| Stil | Tasarım token'larıyla elle yazılmış CSS (UI çatısı yok) |
| Backend | C# / ASP.NET Core Web API (controller + servis katmanı) |
| ORM | Entity Framework Core |
| Veritabanı | PostgreSQL (Npgsql sağlayıcısı) |

---

## Depo yapısı

```
Steady/
├─ backend/
│  └─ Steady.Api/          ASP.NET Core Web API
├─ frontend/               React + Vite + TypeScript uygulaması
└─ dotnet-tools.json       Depoya özel .NET araçları (dotnet-ef)
```

### Backend yapısı

```
backend/Steady.Api/
├─ Controllers/    HTTP uç noktaları (Health, Tasks, FocusSessions, TimerPreferences)
├─ Data/           EF Core DbContext + varlık yapılandırmaları
├─ Dtos/           İstek/yanıt sözleşmeleri
├─ Entities/       Veritabanı varlıkları
├─ Migrations/     EF Core migration'ları (depoda)
├─ Services/       Arayüzlerin arkasındaki iş mantığı
└─ Validation/     Özel doğrulama nitelikleri
```

### Frontend yapısı

```
frontend/src/
├─ api/            Tipli fetch istemcisi ve uç nokta yardımcıları
├─ components/
│  ├─ ui/          Yeniden kullanılabilir bileşenler (Button, Card, Badge, Switch, Modal, …)
│  └─ layout/      Uygulama kabuğu (AppShell, gezinme, tema düğmesi)
├─ features/
│  ├─ sessions/    Oturum geçmişi ve istatistikler: sağlayıcı, kayıt listesi, grafik, kutular
│  ├─ tasks/       Görev listesi, formlar, filtreler ve odak süresi görev seçici
│  └─ timer/       Odak zamanlayıcısı: durum, sağlayıcı, uyarı, arayüz
├─ hooks/          Yeniden kullanılabilir React hook'ları
├─ pages/          Her ekran için bir dosya
├─ router/         Küçük hash router (yönlendirme bağımlılığı yok)
├─ styles/         Tasarım token'ları (renk, tipografi, boşluk, hareket)
├─ theme/          Tema bağlamı ve kalıcılığı
├─ types/          API veri tipleri
└─ utils/          Küçük ortak yardımcılar
```

### Tasarım sistemi

Tüm renk, tipografi, boşluk, köşe yarıçapı ve hareket değerleri
`frontend/src/styles/theme.css` içindeki tasarım token'larıdır. Tema, `<html>` üzerindeki
`data-theme="dark|light"` ile yönetilir; seçim `localStorage`'da hatırlanır ve işletim sistemi
ayarına geri düşer.

Arayüzü erişilebilir tutan iki kural var:

1. Her etkileşimli öğe, görünür odak stiline sahip gerçek ve odaklanabilir bir kontroldür.
2. Metin olarak kullanılan marka renklerinin, yumuşak arka planlarında WCAG AA 4.5:1 karşıtlık
   oranını karşılayan metin için güvenli `*-ink` varyantı vardır.

Uygulama, her ekranda ve iki temada da Lighthouse'ta **erişilebilirlik, en iyi uygulamalar ve SEO
için 100/100** alır. Düzen 320px'lik bir telefondan geniş bir masaüstüne kadar denenir ve her
kontrole klavyeden ulaşılıp kullanılabilir.

---

## Ön koşullar

- **Node.js 20+** (v24 üzerinde geliştirildi) ve npm
- **.NET SDK 10**
- **PostgreSQL 16+** (18 üzerinde geliştirildi) — Steady'nin `steady` veritabanına sahip çalışan bir
  kümeye ihtiyacı vardır. Aşağıdaki 1. adım nasıl oluşturulacağını gösterir.

> Windows'ta `npm`, PowerShell yürütme ilkesi tarafından engelleniyorsa `npm.cmd` kullan.
>
> Depo, `dotnet-ef` için yerel bir .NET araç bildirimi (`dotnet-tools.json`) taşır; bu yüzden
> migration'lar global kurulum gerektirmez — bir kez `dotnet tool restore` yeter.

---

## Başlarken

### 1. PostgreSQL

Steady, `steady_app` uygulama rolünün sahip olduğu `steady` adlı bir veritabanı bekler. Herhangi bir
PostgreSQL kurulumu çalışır; aşağıdaki komutlar özel bir yerel küme oluşturur (Windows servisi ve
yönetici hakları gerekmez). Bunları PostgreSQL'in `bin` dizininden ya da o dizin `PATH`'teyken
çalıştır.

Kümeyi bir kez oluştur:

```bash
initdb -D "$LOCALAPPDATA/Steady/pgsql/data" -U postgres --auth-local=scram-sha-256 \
  --auth-host=scram-sha-256 --pwfile=<password-file> --encoding=UTF8 --locale=C
```

Başlat ve durdur:

```bash
pg_ctl -D "$LOCALAPPDATA/Steady/pgsql/data" -l "$LOCALAPPDATA/Steady/pgsql/logs/postgres.log" \
  -o "-p 5432 -c listen_addresses=127.0.0.1" start

pg_isready -h 127.0.0.1 -p 5432
pg_ctl -D "$LOCALAPPDATA/Steady/pgsql/data" stop
```

Uygulama rolünü ve veritabanını oluştur (`postgres` süper kullanıcısı olarak):

```sql
CREATE ROLE steady_app LOGIN PASSWORD '<your-password>' NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE steady OWNER steady_app ENCODING 'UTF8' TEMPLATE template0;
```

Küme yalnızca `127.0.0.1` üzerinde dinler ve SCRAM-SHA-256 parola kimlik doğrulaması kullanır.

### 2. Bağlantı dizesi

**Sırlar asla depoya eklenmez.** Bağlantı dizesi geliştirmede `.NET user-secrets`, üretimde ortam
değişkenleri üzerinden verilir. Yoksa API başlangıçta açıklayıcı bir mesajla hızlıca başarısız olur.

```bash
cd backend/Steady.Api
dotnet user-secrets set "ConnectionStrings:Default" "Host=127.0.0.1;Port=5432;Database=steady;Username=steady_app;Password=<your-password>"
dotnet tool restore
dotnet ef database update
```

`dotnet ef database update` depodaki migration'ları uygular ve şemayı oluşturur.

### 3. API

```bash
cd backend/Steady.Api
dotnet run
```

API <http://localhost:5080> üzerinde dinler. Şununla doğrula:

```bash
curl http://localhost:5080/api/health
```

Yanıt hem API'yi hem de veritabanını bildirir:

```json
{ "status": "ok", "service": "Steady.Api", "version": "1.0.0.0",
  "database": "connected", "timestampUtc": "..." }
```

Ulaşılamayan bir veritabanı, `"database": "unavailable"` ile `503` döner.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

<http://localhost:5173> adresini aç. Kabuk, API'ye ulaşılıp ulaşılamadığını bildirir.

Frontend, API temel adresini `VITE_API_BASE_URL` üzerinden okur (`frontend/.env.example` dosyasına
bak); bulamazsa `http://localhost:5080` adresine düşer.

### Migration ekleme

```bash
cd backend/Steady.Api
dotnet ef migrations add <Name>
dotnet ef database update
```

---

## Odak zamanlayıcısı

Zamanlayıcı, tüm uygulamayı saran `TimerProvider` içinde yaşar; bu yüzden Görevler veya İstatistik
ekranındayken de çalışan bir oturum tik atmaya devam eder ve seni uyarabilir.

| Kontrol | Davranış |
| ------- | -------- |
| Mod | İstediğin zaman **Odak** ve **Mola** arasında geçiş yap |
| Başlat / Duraklat / Devam et | Mevcut durumu yansıtan tek ana buton |
| Sıfırla | Geçerli modu tam süresine döndürür |
| Hazır süreler | 30 / 45 / 60 / 90 dakika (yalnızca bekleme durumunda) |
| Odak süresi | 1–120 dakika, 1'er dakikalık adımlarla; Odak ekranında ya da Ayarlar'da elle yazılır |
| Mola süresi | 1–30 dakika, 1'er dakikalık adımlarla; Odak ekranında ya da Ayarlar'da elle yazılır |
| Sesli uyarı | Web Audio API ile üretilen dört notalı zil sesi, ~2,5 saniye — ses dosyası yok |
| Masaüstü bildirimi | İsteğe bağlı; etkinleştirdiğinde tarayıcı bir kez izin ister |

Klavye kısayolları: **Boşluk** başlatır veya duraklatır, **R** sıfırlar. Sen yazarken ya da bir
kontrol odaktayken yok sayılırlar.

Bir oturum bittiğinde Steady zil sesini çalar, isteğe bağlı olarak masaüstü bildirimi gönderir, bir
mesaj gösterir ve başlamaya hazır şekilde diğer moda geçer. Geri sayım her zaman bir sayaç
eksilterek değil, mutlak bir bitiş zaman damgasından türetilir; böylece yeniden render'larda, sekme
arka plana atıldığında (tarayıcıların zamanlayıcıları kısıtladığı yerde) ve sayfa yenilendikten
sonra doğru kalır. Kalan süre ayrıca tarayıcı sekmesinin başlığına yansıtılır.

Çalışan oturum `localStorage`'da saklanır, böylece bir yenileme süren bir oturumu asla kaybetmez;
**zamanlayıcı tercihlerin ise PostgreSQL'de saklanır** — aşağıdaki *Zamanlayıcı tercihleri*
bölümüne bak. **Tamamlanan odak oturumları da PostgreSQL'e yazılır** — aşağıdaki *Oturumlar ve
geçmiş* bölümüne bak.

---

## Zamanlayıcı tercihleri

Odak süresi, mola süresi, sesli uyarı ve masaüstü bildirimi tercihi PostgreSQL'de saklanır; böylece
Steady'yi açan her tarayıcıda aynıdırlar, tek bir makinenin ayarı değildir.

Steady'de hesap yoktur, bu yüzden tercihler kuruluma aittir: `timer_preferences`, anahtarı bir
veritabanı check constraint'i ile sabitlenmiş tek bir satırdır ve API bunu bir koleksiyon yerine tek
bir belge olarak sunar.

| Metot | Yol | Davranış |
| ----- | --- | -------- |
| `GET` | `/api/preferences/timer` | Kayıtlı tercihler. Satır eksik olduğu için asla başarısız olmaz |
| `PUT` | `/api/preferences/timer` | Tercihleri değiştirir; bir süre aralığın dışındaysa alan bazlı hatalarla `400` |

Zamanlayıcıyla ilgili hiçbir şey ağı beklemez. Cihaz önbellekte bir kopya tutar; bu kopya anında
kullanılır ve zamanlayıcının çevrimdışıyken ve API kapalıyken çalışmaya devam etmesini sağlar:

- Yüklemede önbellekteki tercihler anında boyanır ve kayıtlı kopya geldiğinde benimsenir.
- Bir düzenleme önce yerelde uygulanır, sonra gönderilir. API reddederse yeni değer cihazda kalır,
  Ayarlar kartı *Bu cihaza kaydedildi* yazar ve **Tekrar dene** sunar. Değişiklik ayrıca bekleyen
  olarak hatırlanır, böylece sonraki ziyaret onu eski kayıtlı kopyayla ezmek yerine gönderir —
  başarısız olan bir kayıt asla sessizce geri alınmaz.

İki ayrıntı bilinçlidir:

- **Bildirim izni saklanamaz.** Kaydedilen anahtar senin *niyetindir* ve cihazlar arasında seninle
  gelir; ama izni yalnızca bir tarayıcı verebilir, bu yüzden Steady bildirimi ancak o tarayıcı zaten
  izin vermişse gönderir — ikisi çeliştiğinde Ayarlar bunu söyler.
- **Süreler üç kez sınırlanır** — formda, API'nin doğrulamasında ve bir veritabanı check
  constraint'inde — böylece aralık dışı bir değer, ilk ikisini atlayan bir istemci tarafından bile
  saklanamaz.

**Tema** bilinçli olarak dışarıda bırakılmıştır: baktığın ekranın bir özelliğidir, bu yüzden
`localStorage`'da cihazda kalır.

---

## Görevler

Görevler ekranı, `/api/tasks` uç noktaları için tam bir CRUD istemcisidir. Yerelde hiçbir şey
önbelleğe alınmaz: her değişiklik PostgreSQL'e gider ve liste API'den yeniden okunur.

| Eylem | Davranış |
| ----- | -------- |
| Ekle | Bir başlık yaz ve **Görev ekle**'ye ya da Enter'a bas. Başlık boş olamaz ve 200 karakterle sınırlıdır |
| Tamamla / yeniden aç | Her satırdaki onay kutusu; `completed_at` sunucu tarafından ayarlanır ve temizlenir |
| Düzenle | Başlık ve isteğe bağlı notlar (en fazla 2000 karakter) için bir pencere açar |
| Sil | Önce onay ister |
| Filtrele | **Tümü / Bekleyen / Tamamlanan**, her biri canlı sayı gösterir |
| Odaklan | Görevi zamanlayıcıya bağlar ve Odak ekranına geçer |

Başlık ve notlar tarayıcıda, API'nin uyguladığı aynı kurallarla denetlenir; böylece bariz hatalar
ağa hiç ulaşmaz — ama API yine de her şeyi doğrular.

**Bir oturumu göreve bağlama.** Odak ekranında bir *Odaklandığın görev* kartı vardır. Orada bir
görev seçmek — ya da bir satırda **Odaklan**'a basmak — o görevi geçerli odak hedefi yapar,
`localStorage`'da hatırlar ve Görevler ekranında satırı işaretler. Oturum bittiğinde Steady onu bu
görev kimliğiyle birlikte kaydeder.

Yükleme, boş ve hata durumlarının tümü ele alınır: liste yüklenirken iskeletler, API'ye
ulaşılamadığında bir tekrar dene butonu ve "henüz görev yok" ile "bu filtreye uyan görev yok" için
farklı boş mesajlar gösterilir. Başarısız bir yazma, iyimser güncellemeyi geri alır ve nedenini
gösterir.

---

## Oturumlar ve geçmiş

Bir **odak** oturumu sıfıra ulaştığında zamanlayıcı onu kaydeder — molalar bilinçli olarak
kaydedilmez, çünkü mola odak süresi değildir. Yalnızca tamamlanan oturumlar sayılır: yarıda
sıfırlamak veya mod değiştirmek iz bırakmaz, böylece sayılar söylediğini anlatır.

Kayıt, geri sayım bittiği anda istemci tarafından yazılır; zamanlayıcının başka bir ekrandayken
çalışmaya devam edebilmesinin nedeni budur. Yazma başarısız olursa oturum kaybolmak yerine
**Tekrar dene** eylemiyle ekranda tutulur.

| Alan | Anlamı |
| ---- | ------ |
| `startedAt` | İlk kez başlata bastığın an; duraklatmak bunu değiştirmez |
| `completedAt` | Geri sayımın sıfıra ulaştığı an |
| `durationMinutes` | Odaklanılan süre — yapılandırılmış uzunluk; duraklattıysan duvar saati aralığından kısadır |
| `taskTitle` | Oturum anındaki görev başlığı, anlık görüntü olarak saklanır |

Bu anlık görüntü önemlidir: bir görevi silmek bağlantıyı temizler (`ON DELETE SET NULL`) ama oturum
başlığını korur, böylece geçmişin ne üzerinde çalıştığını söylemeye devam eder. Bir görevi yeniden
adlandırmak da geçmişi yeniden yazmaz.

**Nerede görünür.** Odak ekranı son beş oturumu listeler; İstatistik, yerel güne göre gruplanmış tam
kaydı günlük toplam ve oturum sayısıyla gösterir. İkisi de aynı sağlayıcıyı okur, böylece İstatistik
ekranındayken biten bir oturum yenileme olmadan görünür.

Steady en son 100 oturumu tek bir istekle yükler; bu, hem kaydı hem de istatistikleri sınırlar. Bu
pencere dolduğunda kayıt bunu söyler — `Son 100 oturum gösteriliyor.` — kısmi bir toplamı tüm hikâye
gibi göstermek yerine.

---

## İstatistikler

İstatistik ekranı üç soruyu yanıtlar ve bir grafik çizer; hepsi yukarıdaki oturumlardan. İkinci bir
doğruluk kaynağı ve ayrı bir istatistik uç noktası yoktur: rakamlar tarayıcıda, kaydın gösterdiği
aynı listeden hesaplanır, böylece özet ve ayrıntı çelişemez.

| Rakam | Tanım |
| ----- | ----- |
| Bugünkü odak | Oturumu bugün biten odaklanılmış dakikalar |
| Bugünkü oturumlar | Kaç tane olduğu — kutu ayrıca ortalama uzunluğunu gösterir |
| Bu haftaki odak | Geçerli haftanın **Pazartesi**'sinden beri odaklanılan dakikalar |
| Günlük odak süresi | Son yedi gün, her gün için bir çubuk, bugün vurgulu |

Günler **yerel** takvim günleridir: "bugün" senin bugünün, saatler önce başlamış ya da bitmiş
olabilecek bir UTC günü değil; hafta Pazartesi başlar. Odak ekranındaki *Bugün* kartı, *Bugünkü
odak* ve *Bugünkü oturumlar* ile aynı iki sayıyı okur, böylece iki ekran her zaman uyuşur.

Grafik, bir grafik bağımlılığı değil düz CSS'tir. Her çubuk rakamını metin olarak taşır ve her gün
ekran okuyucular için açıkça yazılır — "17 Ekim Cumartesi: 40 dk, 2 oturum." — böylece hiçbir şey
yalnızca renkle anlatılmaz. Kayıtlı oturumu olan bir gün her zaman bir çubuk dilimi gösterir,
böylece kısa bir oturum izin günü gibi görünemez.

Boş da geçerli bir yanıttır: henüz hiçbir şey kayıtlı değilse kartlar sıfır okur ve grafik bunu
söyler, ekranın hiçliğe çökmesi yerine.

---

## API uç noktaları

| Metot | Yol | Açıklama |
| ----- | --- | -------- |
| GET | `/api/health` | Canlılık + hazırlık. PostgreSQL yanıtladığında `200`, yanıtlamadığında `503` |
| GET | `/api/tasks` | Görevleri listeler. İsteğe bağlı `?status=all\|pending\|completed` (önce bekleyenler, en yeni önce) |
| GET | `/api/tasks/{id}` | Tek bir görevi getirir |
| POST | `/api/tasks` | Görev oluşturur. `Location` başlığıyla `201` |
| PUT | `/api/tasks/{id}` | Başlığı, notları ve tamamlanma durumunu günceller |
| DELETE | `/api/tasks/{id}` | Görevi siler. Başarıda `204`, hiç yoksa `404` |
| GET | `/api/focus-sessions` | Tamamlanan oturumları en yeni önce listeler. İsteğe bağlı `?limit=` (varsayılan 20, en fazla 100) |
| GET | `/api/focus-sessions/{id}` | Tek bir oturumu getirir |
| POST | `/api/focus-sessions` | Tamamlanan bir oturumu kaydeder. `Location` başlığıyla `201` |
| GET | `/api/preferences/timer` | Kayıtlı zamanlayıcı tercihleri |
| PUT | `/api/preferences/timer` | Kayıtlı zamanlayıcı tercihlerini değiştirir |

Tüm hatalar RFC 9457 problem yanıtları kullanır. Doğrulama hataları, örneğin boş ya da 201
karakterlik bir başlık için alan bazlı bir `errors` nesnesiyle `400` döner. Tamamlanma zaman
damgalarını sunucu yönetir: `completed_at`, bir görev tamamlandığında ayarlanır ve yeniden
açıldığında temizlenir.

`/api/focus-sessions` uç noktasına gönderilen zaman damgaları **herhangi bir** saat dilimi kaymasıyla
kabul edilir ve UTC'ye normalize edilir, çünkü PostgreSQL'in `timestamptz` türü yalnızca `0`
kaymasını saklar. Bilinmeyen bir `taskId` hata değildir: oturum, harcadığın zamanı kaybetmek yerine
bağlantı olmadan kaydedilir.

İstek ve yanıt gövdeleri camelCase JSON kullanır:

```json
{ "id": "01a14805-d960-7c38-b640-793ce344018b", "title": "Write the README",
  "notes": null, "isCompleted": false,
  "createdAt": "2026-10-17T04:01:45.312701+00:00", "completedAt": null }
```

```json
{ "id": "01a14857-201a-7e4d-8ba4-f78189ae71a9", "taskId": null,
  "taskTitle": "Write the README", "durationMinutes": 30,
  "startedAt": "2026-10-16T06:05:00+00:00", "completedAt": "2026-10-16T06:35:00+00:00" }
```

```json
{ "workMinutes": 30, "breakMinutes": 5, "soundEnabled": true,
  "notificationsEnabled": false, "updatedAt": "2026-10-17T05:53:54.514868+00:00" }
```

### Veritabanı şeması

Her tablo snake_case adlar kullanır ve depodaki migration'larla oluşturulur.

`tasks` (`InitialCreate`):

| Sütun | Tür | Notlar |
| ----- | --- | ------ |
| `id` | `uuid` | Birincil anahtar, UUIDv7 (yaklaşık ekleme sırasına göre) |
| `title` | `varchar(200)` | Zorunlu |
| `notes` | `varchar(2000)` | İsteğe bağlı |
| `is_completed` | `boolean` | Zorunlu, indeksli |
| `created_at` | `timestamptz` | Zorunlu, indeksli |
| `completed_at` | `timestamptz` | Tamamlandığında ayarlanır |

`focus_sessions` (`AddFocusSessions`):

| Sütun | Tür | Notlar |
| ----- | --- | ------ |
| `id` | `uuid` | Birincil anahtar, UUIDv7 |
| `task_id` | `uuid` | `tasks(id)` için isteğe bağlı FK, `ON DELETE SET NULL`, indeksli |
| `task_title` | `varchar(200)` | Başlığın anlık görüntüsü, görev silindikten sonra da korunur |
| `started_at` | `timestamptz` | Zorunlu |
| `completed_at` | `timestamptz` | Zorunlu, indeksli — geçmiş en yeni önce okunur |
| `duration_minutes` | `integer` | Zorunlu; odaklanılan süre |

`timer_preferences` (`AddTimerPreferences`) — tam olarak bir satır, migration tarafından eklenir:

| Sütun | Tür | Notlar |
| ----- | --- | ------ |
| `id` | `smallint` | Birincil anahtar, `ck_timer_preferences_singleton` check constraint'i ile `1`'e sabitlenmiştir |
| `work_minutes` | `integer` | Zorunlu, `1–120` (check constraint) |
| `break_minutes` | `integer` | Zorunlu, `1–30` (check constraint) |
| `sound_enabled` | `boolean` | Zorunlu |
| `notifications_enabled` | `boolean` | Zorunlu; kullanıcının niyeti, verilmiş bir izin değil |
| `updated_at` | `timestamptz` | Zorunlu; satırın son yazıldığı an |

Yukarıdaki her tablo depodaki bir migration ile oluşturulur, bu yüzden boş bir veritabanı hazırlamak
için `dotnet ef database update` yeterlidir.

---

## Bilinen sınırlamalar

Steady bir portföy projesidir, bu yüzden birkaç sınır kazara değil bilinçlidir:

- **Hesap yok.** Tercihler ve geçmiş, bir kullanıcıya değil kuruluma aittir ve API yerel kullanım
  için tasarlanmıştır, bu yüzden kimlik doğrulama olmadan gelir.
- **Kayıt istemci tarafından yönetilir.** Tarayıcı oturumu geri sayım bittiğinde yazar; başka bir
  ekrandayken zamanlayıcının çalışmaya devam etmesini sağlayan da budur — ama bir oturumu ikisi de
  bitiren iki sekme birer kayıt yazabilir.
- **İstatistikler en son 100 oturumu kapsar.** Bu pencere kaydı ve toplamları birlikte sınırlar ve
  ekran dolduğunda bunu söyler.
- **Molalar kaydedilmez.** Yalnızca odak oturumları saklanır, çünkü mola odak süresi değildir.

---

## Geliştirme kuralları

Steady küçük ve gözden geçirilebilir aşamalarla geliştirildi. Her aşama, değişen dosyaların ve test
sonuçlarının bir özetiyle bitti ve bir sonraki aşama ancak onaydan sonra başladı — yukarıdaki durum
tablosu o on aşamanın kaydıdır.
