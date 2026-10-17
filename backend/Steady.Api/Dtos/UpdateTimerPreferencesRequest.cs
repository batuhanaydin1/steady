using System.ComponentModel.DataAnnotations;
using Steady.Api.Entities;

namespace Steady.Api.Dtos;

/// <summary>
/// Body of <c>PUT /api/preferences/timer</c>. The whole document is replaced, so
/// every field is required: a partial update would have to distinguish "leave it"
/// from "clear it" with a third state.
/// </summary>
public sealed class UpdateTimerPreferencesRequest
{
    [Range(
        TimerPreferences.WorkMinutesMin,
        TimerPreferences.WorkMinutesMax,
        ErrorMessage = "WorkMinutes must be between 5 and 120.")]
    public int WorkMinutes { get; set; }

    [Range(
        TimerPreferences.BreakMinutesMin,
        TimerPreferences.BreakMinutesMax,
        ErrorMessage = "BreakMinutes must be between 1 and 30.")]
    public int BreakMinutes { get; set; }

    public bool SoundEnabled { get; set; }

    /// <summary>
    /// The user's intent. The API stores it; whether a given browser can deliver
    /// a notification is that browser's business.
    /// </summary>
    public bool NotificationsEnabled { get; set; }
}
