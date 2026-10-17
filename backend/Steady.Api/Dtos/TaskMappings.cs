using Steady.Api.Entities;

namespace Steady.Api.Dtos;

/// <summary>Keeps entity-to-DTO mapping in one place.</summary>
public static class TaskMappings
{
    public static TaskResponse ToResponse(this TaskItem task) =>
        new(
            task.Id,
            task.Title,
            task.Notes,
            task.IsCompleted,
            task.CreatedAt,
            task.CompletedAt);
}
