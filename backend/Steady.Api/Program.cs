using Microsoft.EntityFrameworkCore;
using Steady.Api.Data;
using Steady.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCors";

// The connection string is never committed to source control:
// .NET user-secrets in development, environment variables in production.
// Failing fast here is clearer than throwing on the first request.
var connectionString = builder.Configuration.GetConnectionString("Default");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "ConnectionStrings:Default is not configured. In development run "
        + "\"dotnet user-secrets set \\\"ConnectionStrings:Default\\\" \\\"Host=localhost;Port=5432;Database=steady;Username=steady_app;Password=<password>\\\"\", "
        + "or set the ConnectionStrings__Default environment variable in production.");
}

builder.Services.AddDbContext<SteadyDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql => npgsql.CommandTimeout(10)));

builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IFocusSessionService, FocusSessionService>();
builder.Services.AddScoped<ITimerPreferencesService, TimerPreferencesService>();

builder.Services.AddControllers();

// RFC 9457 problem responses for validation errors, unhandled exceptions and unknown routes.
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// The React dev server and Vite preview server are allowed to talk to this API.
// Origins are configuration-driven so no environment-specific values live in code.
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:5173", "http://localhost:4173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler();
    // TLS is only terminated by the host in non-development environments.
    app.UseHttpsRedirection();
}

app.UseCors(FrontendCorsPolicy);

// Unknown routes answer with a ProblemDetails body instead of an empty response.
app.UseStatusCodePages();

app.MapControllers();

app.Run();

// Exposed so integration tests can spin the API up with WebApplicationFactory.
public partial class Program;
