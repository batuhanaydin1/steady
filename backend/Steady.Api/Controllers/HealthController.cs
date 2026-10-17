using Microsoft.AspNetCore.Mvc;
using Steady.Api.Data;
using Steady.Api.Dtos;

namespace Steady.Api.Controllers;

/// <summary>
/// Liveness and readiness: reports whether the API is reachable and whether
/// PostgreSQL actually answers a connection attempt.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public sealed class HealthController(SteadyDbContext dbContext) : ControllerBase
{
    private static readonly TimeSpan DatabaseProbeTimeout = TimeSpan.FromSeconds(5);

    [HttpGet]
    [ProducesResponseType<HealthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<HealthResponse>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthResponse>> Get(CancellationToken cancellationToken)
    {
        using var probe = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        probe.CancelAfter(DatabaseProbeTimeout);

        var databaseConnected = false;
        try
        {
            databaseConnected = await dbContext.Database.CanConnectAsync(probe.Token);
        }
        catch (Exception) when (!cancellationToken.IsCancellationRequested)
        {
            // An unreachable database must report "degraded", not turn the probe into a 500.
            databaseConnected = false;
        }

        var version = typeof(HealthController).Assembly.GetName().Version?.ToString() ?? "0.0.0";

        var response = new HealthResponse(
            Status: databaseConnected ? "ok" : "degraded",
            Service: "Steady.Api",
            Version: version,
            Database: databaseConnected ? "connected" : "unavailable",
            TimestampUtc: DateTimeOffset.UtcNow);

        return databaseConnected
            ? Ok(response)
            : StatusCode(StatusCodes.Status503ServiceUnavailable, response);
    }
}
