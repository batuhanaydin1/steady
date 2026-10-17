using Steady.Api.Entities;

namespace Steady.Api.Dtos;

/// <summary>Keeps entity-to-DTO mapping in one place.</summary>
public static class FocusSessionMappings
{
    public static FocusSessionResponse ToResponse(this FocusSession session) =>
        new(
            session.Id,
            session.TaskId,
            session.TaskTitle,
            session.StartedAt,
            session.CompletedAt,
            session.DurationMinutes);
}
