namespace Steady.Api.Dtos;

public sealed record TimerPreferencesResponse(
    int WorkMinutes,
    int BreakMinutes,
    bool SoundEnabled,
    bool NotificationsEnabled,
    DateTimeOffset UpdatedAt);
