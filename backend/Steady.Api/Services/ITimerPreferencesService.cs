using Steady.Api.Entities;

namespace Steady.Api.Services;

public interface ITimerPreferencesService
{
    /// <summary>
    /// The saved preferences. Never null: a missing row falls back to the
    /// built-in defaults.
    /// </summary>
    Task<TimerPreferences> GetAsync(CancellationToken cancellationToken);

    /// <summary>Replaces the saved preferences and returns what was stored.</summary>
    Task<TimerPreferences> UpdateAsync(
        int workMinutes,
        int breakMinutes,
        bool soundEnabled,
        bool notificationsEnabled,
        CancellationToken cancellationToken);
}
