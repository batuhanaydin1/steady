using System.ComponentModel.DataAnnotations;
using Steady.Api.Validation;

namespace Steady.Api.Dtos;

public sealed class CreateTaskRequest
{
    [NotBlank(ErrorMessage = "A title is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "The title must be between 1 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "Notes must be 2000 characters or fewer.")]
    public string? Notes { get; set; }
}
