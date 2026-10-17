namespace Steady.Api.Entities;

/// <summary>
/// Something the user wants to work on. Focus sessions are linked to a task in a later phase.
/// </summary>
public sealed class TaskItem
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>Set when the task is completed and cleared when it is reopened.</summary>
    public DateTimeOffset? CompletedAt { get; set; }
}
