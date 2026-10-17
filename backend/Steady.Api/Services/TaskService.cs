using Microsoft.EntityFrameworkCore;
using Steady.Api.Data;
using Steady.Api.Entities;

namespace Steady.Api.Services;

public sealed class TaskService(SteadyDbContext dbContext) : ITaskService
{
    public async Task<IReadOnlyList<TaskItem>> GetAsync(
        TaskFilter filter,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Tasks.AsNoTracking();

        query = filter switch
        {
            TaskFilter.Pending => query.Where(task => !task.IsCompleted),
            TaskFilter.Completed => query.Where(task => task.IsCompleted),
            _ => query,
        };

        return await query
            .OrderBy(task => task.IsCompleted)
            .ThenByDescending(task => task.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(task => task.Id == id, cancellationToken);

    public async Task<TaskItem> CreateAsync(
        string title,
        string? notes,
        CancellationToken cancellationToken)
    {
        var task = new TaskItem
        {
            // UUIDv7 keeps the primary key index roughly in insertion order.
            Id = Guid.CreateVersion7(),
            Title = title.Trim(),
            Notes = NormalizeNotes(notes),
            IsCompleted = false,
            CreatedAt = DateTimeOffset.UtcNow,
            CompletedAt = null,
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync(cancellationToken);

        return task;
    }

    public async Task<TaskItem?> UpdateAsync(
        Guid id,
        string title,
        string? notes,
        bool isCompleted,
        CancellationToken cancellationToken)
    {
        var task = await dbContext.Tasks
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (task is null)
        {
            return null;
        }

        task.Title = title.Trim();
        task.Notes = NormalizeNotes(notes);

        if (task.IsCompleted != isCompleted)
        {
            task.IsCompleted = isCompleted;
            task.CompletedAt = isCompleted ? DateTimeOffset.UtcNow : null;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return task;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        // A single DELETE statement: no read-then-write round trip.
        var deletedRows = await dbContext.Tasks
            .Where(task => task.Id == id)
            .ExecuteDeleteAsync(cancellationToken);

        return deletedRows > 0;
    }

    private static string? NormalizeNotes(string? notes) =>
        string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
}
