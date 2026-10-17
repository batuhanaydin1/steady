using Steady.Api.Entities;

namespace Steady.Api.Dtos;

/// <summary>Keeps entity-to-DTO mapping in one place.</summary>
public static class TimerPreferencesMappings
{
    public static TimerPreferencesResponse ToResponse(this TimerPreferences preferences) =>
        new(
            preferences.WorkMinutes,
            preferences.BreakMinutes,
            preferences.SoundEnabled,
            preferences.NotificationsEnabled,
            preferences.UpdatedAt);
}
