using System.ComponentModel.DataAnnotations;
using Steady.Api.Validation;

namespace Steady.Api.Dtos;

public sealed class CreateTaskRequest
{
    [NotBlank(ErrorMessage = "Başlık zorunlu.")]
    [StringLength(
        200,
        MinimumLength = 1,
        ErrorMessage = "Başlık 1 ile 200 karakter arasında olmalıdır.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "Notlar en fazla 2000 karakter olabilir.")]
    public string? Notes { get; set; }
}
