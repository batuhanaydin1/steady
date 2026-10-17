using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Steady.Api.Entities;

namespace Steady.Api.Data.Configurations;

public sealed class FocusSessionConfiguration : IEntityTypeConfiguration<FocusSession>
{
    public const int TaskTitleMaxLength = 200;

    public void Configure(EntityTypeBuilder<FocusSession> builder)
    {
        builder.ToTable("focus_sessions");

        builder.HasKey(session => session.Id)
            .HasName("pk_focus_sessions");

        builder.Property(session => session.Id).HasColumnName("id");
        builder.Property(session => session.TaskId).HasColumnName("task_id");
        builder.Property(session => session.TaskTitle)
            .HasColumnName("task_title")
            .HasMaxLength(TaskTitleMaxLength);
        builder.Property(session => session.StartedAt)
            .HasColumnName("started_at")
            .IsRequired();
        builder.Property(session => session.CompletedAt)
            .HasColumnName("completed_at")
            .IsRequired();
        builder.Property(session => session.DurationMinutes)
            .HasColumnName("duration_minutes")
            .IsRequired();

        // Deleting a task must not delete the time already spent on it: the
        // session stays, keeps its snapshot title, and simply loses the link.
        builder.HasOne(session => session.Task)
            .WithMany()
            .HasForeignKey(session => session.TaskId)
            .HasConstraintName("fk_focus_sessions_tasks_task_id")
            .OnDelete(DeleteBehavior.SetNull);

        // History is read newest first, and Phase 7 groups by day.
        builder.HasIndex(session => session.CompletedAt)
            .HasDatabaseName("ix_focus_sessions_completed_at");
        builder.HasIndex(session => session.TaskId)
            .HasDatabaseName("ix_focus_sessions_task_id");
    }
}
