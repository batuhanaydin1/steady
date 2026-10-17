# Screenshots

The root README embeds five images from this folder. Drop them in with these exact names and the
section fills in:

| File | Screen | Theme | Size |
| ---- | ------ | ----- | ---- |
| `focus-dark.png` | Focus — timer idle at 25:00, today's totals, recent sessions | dark | 1440×900 |
| `tasks-dark.png` | Tasks — quick add, filters with counts, 4–6 tasks (one completed) | dark | 1440×900 |
| `stats-dark.png` | Stats — summary tiles and the seven-day chart | dark | 1440×900 |
| `focus-light.png` | Focus, exactly as above but light | light | 1440×900 |
| `focus-phone.png` | Focus at a phone width, single column | dark | 390×844 |

Capture the page only (no browser chrome) at 1× device pixel ratio, and save as PNG. In Chrome,
DevTools → *Toggle device toolbar* gives you both the 1440×900 desktop size and the 390×844
phone size, and the theme is the **Light / Dark** switch in the app's header.

## Make the screens look real

The database ships empty, so seed a little data first — a few tasks and a spread of sessions give
the chart and the history something to show. With the API running:

```powershell
$base = 'http://localhost:5080/api'

$tasks = @(
  'Outline the release notes',
  'Review pull request #482',
  'Read the EF Core migrations chapter'
)
foreach ($title in $tasks) {
  Invoke-RestMethod "$base/tasks" -Method Post -ContentType 'application/json' `
    -Body (@{ title = $title; notes = $null } | ConvertTo-Json) | Out-Null
}

# A week of focus sessions: 45, 25, 60, 90, 15, 30 and 50 minutes.
$minutes = 45, 25, 60, 90, 15, 30, 50
for ($day = 0; $day -lt $minutes.Count; $day++) {
  $completed = (Get-Date).Date.AddDays(-$day).AddHours(14)
  Invoke-RestMethod "$base/focus-sessions" -Method Post -ContentType 'application/json' -Body (@{
    startedAt       = $completed.AddMinutes(-$minutes[$day]).ToUniversalTime().ToString('o')
    completedAt     = $completed.ToUniversalTime().ToString('o')
    durationMinutes = $minutes[$day]
    taskId          = $null
  } | ConvertTo-Json) | Out-Null
}
```

Clear it afterwards with `DELETE FROM focus_sessions; DELETE FROM tasks;` — or leave it, since a
portfolio demo reads better with data than with zeros.
