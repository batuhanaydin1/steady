using Steady.Api.Entities;

namespace Steady.Api.Services;

public interface IFocusSessionService
{
    /// <summary>Most recent sessions first.</summary>
    Task<IReadOnlyList<FocusSession>> GetRecentAsync(int limit, CancellationToken cancellationToken);

    Task<FocusSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<FocusSession> CreateAsync(
        DateTimeOffset startedAt,
        DateTimeOffset completedAt,
        int durationMinutes,
        Guid? taskId,
        CancellationToken cancellationToken);
}
