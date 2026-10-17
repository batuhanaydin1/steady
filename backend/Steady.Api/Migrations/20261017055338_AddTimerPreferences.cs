using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Steady.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTimerPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "timer_preferences",
                columns: table => new
                {
                    id = table.Column<short>(type: "smallint", nullable: false),
                    work_minutes = table.Column<int>(type: "integer", nullable: false),
                    break_minutes = table.Column<int>(type: "integer", nullable: false),
                    sound_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    notifications_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_timer_preferences", x => x.id);
                    table.CheckConstraint("ck_timer_preferences_break_minutes", "break_minutes between 1 and 30");
                    table.CheckConstraint("ck_timer_preferences_singleton", "id = 1");
                    table.CheckConstraint("ck_timer_preferences_work_minutes", "work_minutes between 5 and 120");
                });

            // The single row exists from the moment the table does, so every read has
            // something to return and no code path has to create it — no "get or
            // create" race, and nothing to test twice. The values are literals on
            // purpose: a migration records the schema at one point in time and must
            // not follow the defaults if they are changed later.
            migrationBuilder.Sql(
                """
                INSERT INTO timer_preferences
                    (id, work_minutes, break_minutes, sound_enabled, notifications_enabled, updated_at)
                VALUES
                    (1, 25, 5, TRUE, FALSE, now());
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "timer_preferences");
        }
    }
}
