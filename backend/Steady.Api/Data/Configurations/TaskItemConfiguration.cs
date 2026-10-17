using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Steady.Api.Entities;

namespace Steady.Api.Data.Configurations;

public sealed class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public const int TitleMaxLength = 200;
    public const int NotesMaxLength = 2000;

    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("tasks");

        builder.HasKey(task => task.Id)
            .HasName("pk_tasks");

        // snake_case identifiers: PostgreSQL folds unquoted names to lower case,
        // so "Title" would otherwise need quoting in every hand-written query.
        builder.Property(task => task.Id).HasColumnName("id");
        builder.Property(task => task.Title)
            .HasColumnName("title")
            .IsRequired()
            .HasMaxLength(TitleMaxLength);
        builder.Property(task => task.Notes)
            .HasColumnName("notes")
            .HasMaxLength(NotesMaxLength);
        builder.Property(task => task.IsCompleted)
            .HasColumnName("is_completed")
            .IsRequired();
        builder.Property(task => task.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();
        builder.Property(task => task.CompletedAt)
            .HasColumnName("completed_at");

        // The task list filters on completion and sorts by creation date.
        builder.HasIndex(task => task.IsCompleted)
            .HasDatabaseName("ix_tasks_is_completed");
        builder.HasIndex(task => task.CreatedAt)
            .HasDatabaseName("ix_tasks_created_at");
    }
}
