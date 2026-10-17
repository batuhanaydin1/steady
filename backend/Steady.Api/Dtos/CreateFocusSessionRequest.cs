using System.ComponentModel.DataAnnotations;

namespace Steady.Api.Dtos;

public sealed class CreateFocusSessionRequest : IValidatableObject
{
    private DateTimeOffset? _startedAt;
    private DateTimeOffset? _completedAt;

    /// <summary>
    /// When the user first pressed start. Normalised to UTC as it arrives:
    /// PostgreSQL's <c>timestamptz</c> only accepts offset 0, while a client is
    /// entitled to send its own offset.
    /// </summary>
    [Required(ErrorMessage = "Başlangıç zamanı zorunlu.")]
    public DateTimeOffset? StartedAt
    {
        get => _startedAt;
        set => _startedAt = value?.ToUniversalTime();
    }

    /// <summary>When the countdown reached zero. Normalised to UTC.</summary>
    [Required(ErrorMessage = "Bitiş zamanı zorunlu.")]
    public DateTimeOffset? CompletedAt
    {
        get => _completedAt;
        set => _completedAt = value?.ToUniversalTime();
    }

    [Range(1, 600, ErrorMessage = "Süre 1 ile 600 dakika arasında olmalıdır.")]
    public int DurationMinutes { get; set; }

    /// <summary>
    /// The task the session was linked to. An unknown id is ignored rather than
    /// rejected: losing a completed session over a stale task link would be
    /// worse than recording it without one.
    /// </summary>
    public Guid? TaskId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartedAt is not { } startedAt || CompletedAt is not { } completedAt)
        {
            yield break;
        }

        if (completedAt <= startedAt)
        {
            yield return new ValidationResult(
                "Bitiş zamanı başlangıçtan sonra olmalıdır.",
                [nameof(CompletedAt)]);
        }
    }
}
