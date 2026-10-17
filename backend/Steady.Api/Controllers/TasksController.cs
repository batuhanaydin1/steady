using Microsoft.AspNetCore.Mvc;
using Steady.Api.Dtos;
using Steady.Api.Services;

namespace Steady.Api.Controllers;

/// <summary>
/// CRUD endpoints for tasks.
/// </summary>
[ApiController]
[Route("api/tasks")]
public sealed class TasksController(ITaskService taskService) : ControllerBase
{
    /// <summary>
    /// Lists tasks. Pass <c>?status=pending</c> or <c>?status=completed</c> to filter;
    /// omit it (or use <c>?status=all</c>) to get everything.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TaskResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<TaskResponse>>> GetTasks(
        [FromQuery] TaskFilter? status,
        CancellationToken cancellationToken)
    {
        var tasks = await taskService.GetAsync(status ?? TaskFilter.All, cancellationToken);

        return Ok(tasks.Select(task => task.ToResponse()).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<TaskResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskResponse>> GetTask(Guid id, CancellationToken cancellationToken)
    {
        var task = await taskService.GetByIdAsync(id, cancellationToken);

        return task is null ? NotFound() : Ok(task.ToResponse());
    }

    [HttpPost]
    [ProducesResponseType<TaskResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TaskResponse>> CreateTask(
        CreateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var created = await taskService.CreateAsync(request.Title, request.Notes, cancellationToken);

        return CreatedAtAction(nameof(GetTask), new { id = created.Id }, created.ToResponse());
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<TaskResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskResponse>> UpdateTask(
        Guid id,
        UpdateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await taskService.UpdateAsync(
            id,
            request.Title,
            request.Notes,
            request.IsCompleted,
            cancellationToken);

        return updated is null ? NotFound() : Ok(updated.ToResponse());
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await taskService.DeleteAsync(id, cancellationToken);

        return deleted ? NoContent() : NotFound();
    }
}
