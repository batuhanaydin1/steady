using Microsoft.EntityFrameworkCore;
using Steady.Api.Entities;

namespace Steady.Api.Data;

/// <summary>
/// EF Core context for the Steady PostgreSQL database.
/// </summary>
public sealed class SteadyDbContext(DbContextOptions<SteadyDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    public DbSet<FocusSession> FocusSessions => Set<FocusSession>();

    public DbSet<TimerPreferences> TimerPreferences => Set<TimerPreferences>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Every entity keeps its mapping in its own IEntityTypeConfiguration.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SteadyDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
