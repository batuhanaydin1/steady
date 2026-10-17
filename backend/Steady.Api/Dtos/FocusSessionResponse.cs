namespace Steady.Api.Dtos;

public sealed record FocusSessionResponse(
    Guid Id,
    Guid? TaskId,
    string? TaskTitle,
    DateTimeOffset StartedAt,
    DateTimeOffset CompletedAt,
    int DurationMinutes);
