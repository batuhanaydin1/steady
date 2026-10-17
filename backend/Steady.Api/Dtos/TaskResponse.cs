namespace Steady.Api.Dtos;

/// <summary>A task as returned by the API.</summary>
public sealed record TaskResponse(
    Guid Id,
    string Title,
    string? Notes,
    bool IsCompleted,
    DateTimeOffset CreatedAt,
    DateTimeOffset? CompletedAt);
