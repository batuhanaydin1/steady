using Steady.Api.Entities;

namespace Steady.Api.Services;

/// <summary>
/// Task persistence. Controllers stay thin; all data access lives behind this abstraction.
/// </summary>
public interface ITaskService
{
    Task<IReadOnlyList<TaskItem>> GetAsync(TaskFilter filter, CancellationToken cancellationToken);

    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<TaskItem> CreateAsync(string title, string? notes, CancellationToken cancellationToken);

    Task<TaskItem?> UpdateAsync(
        Guid id,
        string title,
        string? notes,
        bool isCompleted,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
