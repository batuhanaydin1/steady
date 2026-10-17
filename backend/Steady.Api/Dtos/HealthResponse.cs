namespace Steady.Api.Dtos;

/// <summary>
/// Liveness and readiness payload returned by <c>GET /api/health</c>.
/// Used by the frontend shell to confirm both the API and PostgreSQL are reachable.
/// </summary>
public sealed record HealthResponse(
    string Status,
    string Service,
    string Version,
    string Database,
    DateTimeOffset TimestampUtc);
