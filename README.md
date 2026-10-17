# Steady

> **Build consistency. One session at a time.**

Steady is a focus-timer and task-management web app for everyday use: pick a task, run a
focus session, and watch your daily and weekly consistency build up.

It is built as a professional portfolio project with a real backend, a real database and
a real, working feature set — not a static mockup.

---

## Status

| Phase | Scope | State |
| ----- | ----- | ----- |
| 1 | Project foundation: React frontend shell + ASP.NET Core API with `/api/health` | ✅ Done |
| 2 | Design system and application layout (shell, navigation, theme, UI primitives) | ✅ Done |
| 3 | Focus timer (work / break, presets, notifications, circular progress) | ✅ Done |
| 4 | PostgreSQL + EF Core migrations + Tasks API | ✅ Done |
| 5 | Task management UI | ✅ Done |
| 6 | Session logging and history | ✅ Done |
| 7 | Statistics dashboard and charts | ✅ Done |
| 8 | Timer preferences persisted in PostgreSQL | ✅ Done |
| 9 | Polish, accessibility and responsive QA | ✅ Done |
| 10 | Documentation and final review | ✅ Done |

---

## Features

**Available now**

- **Focus timer** — 5–120 min focus and 1–30 min break, quick presets (15/25/30/45/60/90),
  start / pause / resume / reset, mode switching, circular progress, audible + visual alert,
  and a countdown that stays accurate in a background tab or across a page reload.
- **Tasks** — create, complete, reopen, edit, filter and delete tasks on a real
  PostgreSQL-backed CRUD API with validation, filters and RFC 9457 problem responses.
- **Task-linked focus** — pick the task you are working on from the Focus screen, or jump
  straight to it from a row, and the timer keeps it selected across reloads.
- **Session history** — every completed focus session is saved to the database with the task
  it was linked to, listed on the Focus screen and grouped by day on Stats. A session that
  fails to save is never dropped silently: it stays until you retry it.
- **Statistics** — today's focus time and session count, this week's totals, and a seven-day
  bar chart, all computed from the recorded sessions. Today's figures also sit on the Focus
  screen, so the numbers are where you already are.
- **Preferences that follow you** — focus and break lengths and the alert toggles are stored in
  PostgreSQL, not only on one device. The timer reads a cached copy instantly, so it still works
  while the API is down, and a change the API cannot accept is kept on the device and pushed
  later instead of being lost.
- **Comfortable on any screen** — one hand-written token system drives a dark and a light theme,
  a layout that holds together from a 320px phone to a wide desktop, and smooth animations.
  Everything is reachable from the keyboard with a visible focus ring, dialogs trap and restore
  focus, tap targets stay above the 24px minimum, and `prefers-reduced-motion` switches the
  looping animations off.

---

## Technologies

| Layer | Choice |
| ----- | ------ |
| Frontend | React 19 + Vite + TypeScript |
| Styling | Hand-written CSS with design tokens (no UI framework) |
| Backend | C# / ASP.NET Core Web API (controllers + service layer) |
| ORM | Entity Framework Core |
| Database | PostgreSQL (Npgsql provider) |

---

## Repository layout

```
Steady/
├─ backend/
│  └─ Steady.Api/          ASP.NET Core Web API
├─ frontend/               React + Vite + TypeScript app
└─ dotnet-tools.json       Repo-local .NET tools (dotnet-ef)
```

### Backend structure

```
backend/Steady.Api/
├─ Controllers/    HTTP endpoints (Health, Tasks, FocusSessions, TimerPreferences)
├─ Data/           EF Core DbContext + entity configurations
├─ Dtos/           Request/response contracts
├─ Entities/       Database entities
├─ Migrations/     EF Core migrations (committed)
├─ Services/       Business logic behind interfaces
└─ Validation/     Custom validation attributes
```

### Frontend structure

```
frontend/src/
├─ api/            Typed fetch client and endpoint helpers
├─ components/
│  ├─ ui/          Reusable primitives (Button, Card, Badge, Switch, Modal, …)
│  └─ layout/      Application chrome (AppShell, navigation, theme toggle)
├─ features/
│  ├─ sessions/    Session history and statistics: provider, log, chart, tiles
│  ├─ tasks/       Task list, forms, filters and the focus-time task picker
│  └─ timer/       Focus timer: state, provider, alert, UI
├─ hooks/          Reusable React hooks
├─ pages/          One file per screen
├─ router/         Tiny hash router (no routing dependency)
├─ styles/         Design tokens (colour, type, spacing, motion)
├─ theme/          Theme context and persistence
├─ types/          API payload types
└─ utils/          Small shared helpers
```

### Design system

All colour, typography, spacing, radius and motion values are design tokens in
`frontend/src/styles/theme.css`. Theming is driven by `data-theme="dark|light"` on
`<html>`; the choice is remembered in `localStorage` and falls back to the OS setting.

Two rules keep the interface accessible:

1. Every interactive element is a real, focusable control with a visible focus style.
2. Brand colours used as text have a text-safe `*-ink` variant that meets the WCAG AA
   4.5:1 contrast ratio on their soft backgrounds.

The app scores **100/100 for accessibility, best practices and SEO** in Lighthouse on every
screen, in both themes. The layout is exercised from a 320px phone to a wide desktop, and every
control can be reached and used from the keyboard.

---

## Prerequisites

- **Node.js 20+** (developed on v24) and npm
- **.NET SDK 10**
- **PostgreSQL 16+** (developed on 18) — Steady needs a running cluster with a `steady`
  database. Step 1 below shows how to create one.

> On Windows, if `npm` is blocked by the PowerShell execution policy, use `npm.cmd`.
>
> The repo carries a local .NET tool manifest (`dotnet-tools.json`) for `dotnet-ef`, so
> migrations need no global install — just `dotnet tool restore` once.

---

## Getting started

### 1. PostgreSQL

Steady expects a database named `steady` that the application role `steady_app` owns.
Any PostgreSQL instance works; the commands below create a private local cluster
(no Windows service and no admin rights needed). Run them from PostgreSQL's `bin`
directory, or with that directory on `PATH`.

Create the cluster once:

```bash
initdb -D "$LOCALAPPDATA/Steady/pgsql/data" -U postgres --auth-local=scram-sha-256 \
  --auth-host=scram-sha-256 --pwfile=<password-file> --encoding=UTF8 --locale=C
```

Start and stop it:

```bash
pg_ctl -D "$LOCALAPPDATA/Steady/pgsql/data" -l "$LOCALAPPDATA/Steady/pgsql/logs/postgres.log" \
  -o "-p 5432 -c listen_addresses=127.0.0.1" start

pg_isready -h 127.0.0.1 -p 5432
pg_ctl -D "$LOCALAPPDATA/Steady/pgsql/data" stop
```

Create the application role and database (as the `postgres` superuser):

```sql
CREATE ROLE steady_app LOGIN PASSWORD '<your-password>' NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE steady OWNER steady_app ENCODING 'UTF8' TEMPLATE template0;
```

The cluster only listens on `127.0.0.1` and uses SCRAM-SHA-256 password authentication.

### 2. Connection string

**Secrets are never committed.** The connection string is supplied through `.NET
user-secrets` in development and environment variables in production. Without it the API
fails fast at startup with an explanatory message.

```bash
cd backend/Steady.Api
dotnet user-secrets set "ConnectionStrings:Default" "Host=127.0.0.1;Port=5432;Database=steady;Username=steady_app;Password=<your-password>"
dotnet tool restore
dotnet ef database update
```

`dotnet ef database update` applies the committed migrations and creates the schema.

### 3. API

```bash
cd backend/Steady.Api
dotnet run
```

The API listens on <http://localhost:5080>. Verify it with:

```bash
curl http://localhost:5080/api/health
```

The response reports both the API and the database:

```json
{ "status": "ok", "service": "Steady.Api", "version": "1.0.0.0",
  "database": "connected", "timestampUtc": "..." }
```

A database that cannot be reached returns `503` with `"database": "unavailable"`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The shell reports whether the API is reachable.

The frontend reads the API base URL from `VITE_API_BASE_URL` (see `frontend/.env.example`);
it falls back to `http://localhost:5080`.

### Adding a migration

```bash
cd backend/Steady.Api
dotnet ef migrations add <Name>
dotnet ef database update
```

---

## Focus timer

The timer lives in `TimerProvider`, which wraps the whole app, so a running session keeps
ticking — and can still alert you — while you are on the Tasks or Stats screen.

| Control | Behaviour |
| ------- | --------- |
| Mode | Switch between **Focus** and **Break** at any time |
| Start / Pause / Resume | One primary button that reflects the current state |
| Reset | Returns the current mode to its full length |
| Quick presets | 15 / 25 / 30 / 45 / 60 / 90 minutes (available while idle) |
| Focus length | 5–120 minutes, adjustable in steps of 1 |
| Break length | 1–30 minutes, adjustable in steps of 1 |
| Sound alert | A short two-note chime generated with the Web Audio API — no audio files |
| Desktop notification | Optional; your browser asks for permission once, when you enable it |

Keyboard shortcuts: **Space** starts or pauses, **R** resets. They are ignored while you are
typing or a control has focus.

When a session ends, Steady plays the chime, optionally fires a desktop notification, shows
a message, and switches to the other mode ready to start. The countdown is always derived
from an absolute end timestamp rather than by subtracting a counter, so it stays correct
across re-renders, when the tab is backgrounded (where browsers throttle timers) and after a
page reload. The remaining time is also mirrored into the browser tab title.

The running session is stored in `localStorage`, so a reload never loses a session in progress,
while your **timer preferences are stored in PostgreSQL** — see *Timer preferences* below.
**Completed focus sessions are written to PostgreSQL** too — see *Sessions and history* below.

---

## Timer preferences

Focus length, break length, the sound alert and the desktop-notification opt-in are stored in
PostgreSQL, so they are the same in every browser that opens Steady rather than a setting of one
machine.

Steady has no accounts, so preferences belong to the installation: `timer_preferences` is a
single row whose key is fixed by a database check constraint, and the API exposes it as one
document instead of a collection.

| Method | Route | Behaviour |
| ------ | ----- | --------- |
| `GET` | `/api/preferences/timer` | The saved preferences. Never fails because a row is missing |
| `PUT` | `/api/preferences/timer` | Replaces them; `400` with per-field errors when a length is out of range |

Nothing about the timer waits on the network. The device keeps a cached copy, which is used
immediately and is what keeps the timer working offline and while the API is down:

- On load the cached preferences paint at once, and the stored copy is adopted when it arrives.
- An edit is applied locally first and then sent. If the API refuses it, the new value stays on
  the device, the Settings card reads *Saved on this device* and offers **Try again**. The
  change is also remembered as pending, so the next visit pushes it rather than overwriting it
  with the older stored copy — a save that failed is never silently reverted.

Two details are deliberate:

- **Notification permission cannot be stored.** The saved toggle is your *intent*, which follows
  you between devices, but only a browser can grant the permission, so Steady delivers a
  notification only where that browser has already allowed it — and Settings says so when the
  two disagree.
- **The lengths are bounded three times** — in the form, in the API's validation and in a
  database check constraint — so an out-of-range value cannot be stored even by a client that
  skips the first two.

The **theme** is deliberately left out: it is a property of the screen you are looking at, so it
stays on the device in `localStorage`.

---

## Tasks

The Tasks screen is a full CRUD client for the `/api/tasks` endpoints. Nothing is cached
locally: every change goes to PostgreSQL and the list is re-read from the API.

| Action | Behaviour |
| ------ | --------- |
| Add | Type a title and press **Add task** or Enter. The title cannot be blank and is capped at 200 characters |
| Complete / reopen | The checkbox on each row; `completed_at` is set and cleared by the server |
| Edit | Opens a dialog for the title and optional notes (up to 2000 characters) |
| Delete | Asks for confirmation first |
| Filter | **All / Pending / Completed**, each showing a live count |
| Focus | Links the task to the timer and switches to the Focus screen |

Title and notes are checked in the browser with the same rules the API enforces, so obvious
mistakes never reach the network — but the API still validates everything.

**Linking a session to a task.** The Focus screen has a *Focusing on* card. Picking a task
there — or pressing **Focus** on a row — makes it the current focus target, remembers it in
`localStorage` and marks the row on the Tasks screen. When the session finishes, Steady records
it together with that task id.

Loading, empty and error states are all handled: the list shows skeletons while it loads, a
retry button when the API is unreachable, and different empty messages for "no tasks yet" and
"nothing matches this filter". A failed write rolls the optimistic update back and shows why.

---

## Sessions and history

When a **focus** session reaches zero, the timer records it — breaks are deliberately not
recorded, because a break is not focus time. Only completed sessions count: resetting or
switching mode halfway through leaves no trace, so the numbers mean what they say.

The record is written by the client the moment the countdown ends, which is why the timer can
keep running while you are on another screen. If the write fails, the session is kept on screen
with a **Try again** action rather than being lost.

| Field | Meaning |
| ----- | ------- |
| `startedAt` | When you first pressed start; pausing does not move it |
| `completedAt` | When the countdown reached zero |
| `durationMinutes` | The focused time — the configured length, which is shorter than the wall-clock span if you paused |
| `taskTitle` | The task title at the time of the session, kept as a snapshot |

The snapshot matters: deleting a task clears the link (`ON DELETE SET NULL`) but the session
keeps its title, so your history still says what you were working on. Renaming a task does not
rewrite history either.

**Where it shows up.** The Focus screen lists the five most recent sessions; Stats shows the
full log grouped by local day with a per-day total and a session count. Both read the same
provider, so a session that ends while you are on Stats appears without a reload.

Steady loads the most recent 100 sessions in a single request, which bounds the log *and* the
statistics. When that window is full the log says so — `Showing the latest 100 sessions.` —
rather than passing a partial total off as the whole story.

---

## Statistics

The Stats screen answers three questions and draws one chart, all from the sessions above.
There is no second source of truth and no separate stats endpoint: the figures are computed in
the browser from the same list the log shows, so the summary and the detail cannot disagree.

| Figure | Definition |
| ----- | ---------- |
| Focus today | Focused minutes whose session finished today |
| Sessions today | How many there were — the tile also shows their average length |
| Focus this week | Focused minutes since **Monday** of the current week |
| Focus time per day | The last seven days, one bar per day, with today emphasised |

Days are **local** calendar days: "today" is your today, not a UTC day that may have started or
ended hours ago, and the week starts on Monday. The Focus screen's *Today* card reads the same
two numbers as *Focus today* and *Sessions today*, so the two screens always agree.

The chart is plain CSS, not a charting dependency. Every bar carries its figure as text and each
day is spelled out for screen readers — "Saturday 17 October: 40 min, 2 sessions." in an English
locale — so nothing is communicated by colour alone. A day with a recorded session always shows a
sliver of bar, so a short session cannot look like a day off.

Empty is a valid answer: with nothing recorded yet the cards read zero and the chart says so,
instead of the screen collapsing into nothing.

---

## API endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/health` | Liveness + readiness. `200` when PostgreSQL answers, `503` when it does not |
| GET | `/api/tasks` | List tasks. Optional `?status=all\|pending\|completed` (pending first, newest first) |
| GET | `/api/tasks/{id}` | Fetch one task |
| POST | `/api/tasks` | Create a task. `201` with a `Location` header |
| PUT | `/api/tasks/{id}` | Update title, notes and completion state |
| DELETE | `/api/tasks/{id}` | Delete a task. `204` on success, `404` if it never existed |
| GET | `/api/focus-sessions` | List completed sessions, newest first. Optional `?limit=` (default 20, max 100) |
| GET | `/api/focus-sessions/{id}` | Fetch one session |
| POST | `/api/focus-sessions` | Record a completed session. `201` with a `Location` header |
| GET | `/api/preferences/timer` | The saved timer preferences |
| PUT | `/api/preferences/timer` | Replace the saved timer preferences |

All errors use RFC 9457 problem responses. Validation failures return `400` with a per-field
`errors` object, for example a blank or 201-character title. Completion timestamps are managed
by the server: `completed_at` is set when a task is completed and cleared when it is reopened.

Timestamps sent to `/api/focus-sessions` are accepted in **any** offset and normalised to UTC,
because PostgreSQL's `timestamptz` only stores offset `0`. An unknown `taskId` is not an error:
the session is recorded without the link rather than losing the time you spent.

Request and response bodies use camelCase JSON:

```json
{ "id": "01a14805-d960-7c38-b640-793ce344018b", "title": "Write the README",
  "notes": null, "isCompleted": false,
  "createdAt": "2026-10-17T04:01:45.312701+00:00", "completedAt": null }
```

```json
{ "id": "01a14857-201a-7e4d-8ba4-f78189ae71a9", "taskId": null,
  "taskTitle": "Write the README", "durationMinutes": 25,
  "startedAt": "2026-10-16T06:05:00+00:00", "completedAt": "2026-10-16T06:30:00+00:00" }
```

```json
{ "workMinutes": 25, "breakMinutes": 5, "soundEnabled": true,
  "notificationsEnabled": false, "updatedAt": "2026-10-17T05:53:54.514868+00:00" }
```

### Database schema

Every table uses snake_case identifiers and is created by committed migrations.

`tasks` (`InitialCreate`):

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | Primary key, UUIDv7 (roughly insertion-ordered) |
| `title` | `varchar(200)` | Required |
| `notes` | `varchar(2000)` | Optional |
| `is_completed` | `boolean` | Required, indexed |
| `created_at` | `timestamptz` | Required, indexed |
| `completed_at` | `timestamptz` | Set when completed |

`focus_sessions` (`AddFocusSessions`):

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | Primary key, UUIDv7 |
| `task_id` | `uuid` | Optional FK to `tasks(id)`, `ON DELETE SET NULL`, indexed |
| `task_title` | `varchar(200)` | Snapshot of the title, kept after the task is deleted |
| `started_at` | `timestamptz` | Required |
| `completed_at` | `timestamptz` | Required, indexed — history is read newest first |
| `duration_minutes` | `integer` | Required; the focused time |

`timer_preferences` (`AddTimerPreferences`) — exactly one row, seeded by the migration:

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `smallint` | Primary key, fixed at `1` by the `ck_timer_preferences_singleton` check constraint |
| `work_minutes` | `integer` | Required, `5–120` (check constraint) |
| `break_minutes` | `integer` | Required, `1–30` (check constraint) |
| `sound_enabled` | `boolean` | Required |
| `notifications_enabled` | `boolean` | Required; the user's intent, not a granted permission |
| `updated_at` | `timestamptz` | Required; when the row was last written |

Every table above is created by a committed migration, so `dotnet ef database update` is enough
to prepare an empty database.

---

## Known limitations

Steady is a portfolio project, so a few edges are deliberate rather than accidental:

- **No accounts.** Preferences and history belong to the installation rather than to a user, and
  the API is meant for local use, so it ships without authentication.
- **Recording is client-driven.** The browser writes the session when the countdown ends, which is
  what lets the timer keep running while you are on another screen — but two tabs that both finish
  a session could each record one.
- **Statistics cover the most recent 100 sessions.** That window bounds the log and the totals
  together, and the screen says so when it is full.
- **Breaks are not recorded.** Only focus sessions are stored, because a break is not focus time.

---

## Development rules

Steady was built in small, reviewable phases. Each phase ended with a summary of the changed
files and the test results, and the next phase started only after approval — the status table
above is the record of those ten phases.
