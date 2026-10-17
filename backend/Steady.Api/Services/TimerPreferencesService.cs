using Microsoft.EntityFrameworkCore;
using Steady.Api.Data;
using Steady.Api.Entities;

namespace Steady.Api.Services;

public sealed class TimerPreferencesService(SteadyDbContext dbContext) : ITimerPreferencesService
{
    public async Task<TimerPreferences> GetAsync(CancellationToken cancellationToken)
    {
        // The key is filtered explicitly even though the singleton constraint
        // already guarantees one row: it states the intent, and it keeps EF from
        // warning about a FirstOrDefault without a filter.
        var stored = await dbContext.TimerPreferences
            .AsNoTracking()
            .FirstOrDefaultAsync(row => row.Id == TimerPreferences.SingletonId, cancellationToken);

        // The row is seeded by the migration, so this fallback guards against a
        // hand-edited database: a missing settings row must not take the timer
        // down, and a read must not quietly start a write.
        return stored ?? new TimerPreferences { UpdatedAt = DateTimeOffset.UtcNow };
    }

    public async Task<TimerPreferences> UpdateAsync(
        int workMinutes,
        int breakMinutes,
        bool soundEnabled,
        bool notificationsEnabled,
        CancellationToken cancellationToken)
    {
        var stored = await dbContext.TimerPreferences
            .FirstOrDefaultAsync(row => row.Id == TimerPreferences.SingletonId, cancellationToken);

        if (stored is null)
        {
            // Same guard, but a write really does need the row to exist.
            stored = new TimerPreferences { Id = TimerPreferences.SingletonId };
            dbContext.TimerPreferences.Add(stored);
        }

        stored.WorkMinutes = workMinutes;
        stored.BreakMinutes = breakMinutes;
        stored.SoundEnabled = soundEnabled;
        stored.NotificationsEnabled = notificationsEnabled;
        stored.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return stored;
    }
}
