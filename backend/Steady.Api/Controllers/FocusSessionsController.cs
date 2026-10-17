using Microsoft.AspNetCore.Mvc;
using Steady.Api.Dtos;
using Steady.Api.Services;

namespace Steady.Api.Controllers;

/// <summary>
/// Records completed focus sessions and returns the session history.
/// </summary>
[ApiController]
[Route("api/focus-sessions")]
public sealed class FocusSessionsController(IFocusSessionService sessionService) : ControllerBase
{
    private const int DefaultLimit = 20;
    private const int MaxLimit = 100;

    /// <summary>Lists completed sessions, newest first.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<FocusSessionResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<FocusSessionResponse>>> GetFocusSessions(
        [FromQuery] int? limit,
        CancellationToken cancellationToken)
    {
        var take = Math.Clamp(limit ?? DefaultLimit, 1, MaxLimit);
        var sessions = await sessionService.GetRecentAsync(take, cancellationToken);

        return Ok(sessions.Select(session => session.ToResponse()).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<FocusSessionResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FocusSessionResponse>> GetFocusSession(
        Guid id,
        CancellationToken cancellationToken)
    {
        var session = await sessionService.GetByIdAsync(id, cancellationToken);

        return session is null ? NotFound() : Ok(session.ToResponse());
    }

    [HttpPost]
    [ProducesResponseType<FocusSessionResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FocusSessionResponse>> CreateFocusSession(
        CreateFocusSessionRequest request,
        CancellationToken cancellationToken)
    {
        var created = await sessionService.CreateAsync(
            request.StartedAt!.Value,
            request.CompletedAt!.Value,
            request.DurationMinutes,
            request.TaskId,
            cancellationToken);

        return CreatedAtAction(nameof(GetFocusSession), new { id = created.Id }, created.ToResponse());
    }
}
