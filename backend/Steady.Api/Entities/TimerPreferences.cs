namespace Steady.Api.Entities;

/// <summary>
/// The timer settings of this Steady installation.
///
/// Steady has no accounts, so preferences belong to the installation rather than
/// to a user: the table holds a single row whose key is fixed at
/// <see cref="SingletonId"/> and enforced by a check constraint. Every device that
/// opens the app therefore starts from the same focus and break lengths.
///
/// A notification permission is granted by a browser, not by the database, so
/// <see cref="NotificationsEnabled"/> records the user's <em>intent</em>; the
/// client only delivers notifications where that browser has already allowed it.
/// </summary>
public class TimerPreferences
{
    /// <summary>The only key this table accepts.</summary>
    public const short SingletonId = 1;

    public const int WorkMinutesMin = 1;
    public const int WorkMinutesMax = 120;
    public const int BreakMinutesMin = 1;
    public const int BreakMinutesMax = 30;

    public const int DefaultWorkMinutes = 30;
    public const int DefaultBreakMinutes = 5;
    public const bool DefaultSoundEnabled = true;
    public const bool DefaultNotificationsEnabled = false;

    public short Id { get; set; } = SingletonId;

    /// <summary>Length of a focus session, in minutes.</summary>
    public int WorkMinutes { get; set; } = DefaultWorkMinutes;

    /// <summary>Length of a break, in minutes.</summary>
    public int BreakMinutes { get; set; } = DefaultBreakMinutes;

    /// <summary>Whether a finished session ends with an audible chime.</summary>
    public bool SoundEnabled { get; set; } = DefaultSoundEnabled;

    /// <summary>Whether the user wants a notification when a session finishes.</summary>
    public bool NotificationsEnabled { get; set; } = DefaultNotificationsEnabled;

    /// <summary>When this row was last written.</summary>
    public DateTimeOffset UpdatedAt { get; set; }
}
