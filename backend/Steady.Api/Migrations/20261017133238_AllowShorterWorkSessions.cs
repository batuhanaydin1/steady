using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Steady.Api.Migrations
{
    /// <inheritdoc />
    public partial class AllowShorterWorkSessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences");

            migrationBuilder.AddCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences",
                sql: "work_minutes between 1 and 120");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences");

            migrationBuilder.AddCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences",
                sql: "work_minutes between 30 and 120");
        }
    }
}
