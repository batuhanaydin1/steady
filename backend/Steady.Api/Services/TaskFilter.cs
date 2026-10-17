namespace Steady.Api.Services;

/// <summary>Which tasks a list request should return.</summary>
public enum TaskFilter
{
    All = 0,
    Pending = 1,
    Completed = 2,
}
