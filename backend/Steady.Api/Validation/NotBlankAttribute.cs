using System.ComponentModel.DataAnnotations;

namespace Steady.Api.Validation;

/// <summary>
/// Rejects null, empty and whitespace-only text.
/// <see cref="RequiredAttribute"/> alone accepts "   ", which must not become a task title.
/// </summary>
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public sealed class NotBlankAttribute : ValidationAttribute
{
    public NotBlankAttribute() => ErrorMessage = "This field cannot be blank.";

    public override bool IsValid(object? value) => value is string text && text.Trim().Length > 0;
}
