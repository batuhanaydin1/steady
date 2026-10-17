namespace Steady.Api.Entities;

/// <summary>
/// A completed focus session. Breaks are deliberately not recorded: the
/// statistics are about focused work, and a break is not work.
/// </summary>
public class FocusSession
{
    public Guid Id { get; set; }

    /// <summary>The task that was being focused on, if any. Cleared if the task is deleted.</summary>
    public Guid? TaskId { get; set; }

    public TaskItem? Task { get; set; }

    /// <summary>
    /// The task title at the time of the session. Kept as a snapshot so history
    /// stays readable after the task is renamed or deleted.
    /// </summary>
    public string? TaskTitle { get; set; }

    /// <summary>When the user first pressed start.</summary>
    public DateTimeOffset StartedAt { get; set; }

    /// <summary>When the countdown reached zero.</summary>
    public DateTimeOffset CompletedAt { get; set; }

    /// <summary>
    /// The configured length of the session. This is the focused time, which can
    /// be shorter than the wall-clock span between the two timestamps if the
    /// user paused.
    /// </summary>
    public int DurationMinutes { get; set; }
}
