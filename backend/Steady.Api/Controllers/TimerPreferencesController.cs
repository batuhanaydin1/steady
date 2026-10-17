using Microsoft.AspNetCore.Mvc;
using Steady.Api.Dtos;
using Steady.Api.Services;

namespace Steady.Api.Controllers;

/// <summary>
/// The saved timer preferences.
///
/// With no accounts, the preferences belong to the installation, so this is a
/// single document that gets replaced — not a collection of things to create,
/// list and delete.
/// </summary>
[ApiController]
[Route("api/preferences/timer")]
public sealed class TimerPreferencesController(ITimerPreferencesService preferencesService)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<TimerPreferencesResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<TimerPreferencesResponse>> GetTimerPreferences(
        CancellationToken cancellationToken)
    {
        var preferences = await preferencesService.GetAsync(cancellationToken);

        return Ok(preferences.ToResponse());
    }

    [HttpPut]
    [ProducesResponseType<TimerPreferencesResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TimerPreferencesResponse>> UpdateTimerPreferences(
        UpdateTimerPreferencesRequest request,
        CancellationToken cancellationToken)
    {
        var preferences = await preferencesService.UpdateAsync(
            request.WorkMinutes,
            request.BreakMinutes,
            request.SoundEnabled,
            request.NotificationsEnabled,
            cancellationToken);

        return Ok(preferences.ToResponse());
    }
}
