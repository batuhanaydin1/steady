using Microsoft.EntityFrameworkCore;
using Steady.Api.Data;
using Steady.Api.Entities;

namespace Steady.Api.Services;

public sealed class FocusSessionService(SteadyDbContext dbContext) : IFocusSessionService
{
    public async Task<IReadOnlyList<FocusSession>> GetRecentAsync(
        int limit,
        CancellationToken cancellationToken)
    {
        return await dbContext.FocusSessions
            .AsNoTracking()
            .OrderByDescending(session => session.CompletedAt)
            .ThenByDescending(session => session.Id)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public Task<FocusSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.FocusSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(session => session.Id == id, cancellationToken);

    public async Task<FocusSession> CreateAsync(
        DateTimeOffset startedAt,
        DateTimeOffset completedAt,
        int durationMinutes,
        Guid? taskId,
        CancellationToken cancellationToken)
    {
        // Resolve the task (if any) so the session can snapshot its title. A task
        // that no longer exists is not an error: the session is still recorded,
        // just without the link.
        TaskItem? task = null;
        if (taskId is { } id)
        {
            task = await dbContext.Tasks
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        }

        var session = new FocusSession
        {
            // UUIDv7 keeps the primary key index roughly in insertion order.
            Id = Guid.CreateVersion7(),
            TaskId = task?.Id,
            TaskTitle = task?.Title,
            StartedAt = startedAt,
            CompletedAt = completedAt,
            DurationMinutes = durationMinutes,
        };

        dbContext.FocusSessions.Add(session);
        await dbContext.SaveChangesAsync(cancellationToken);

        return session;
    }
}
