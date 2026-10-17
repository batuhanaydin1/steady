using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Steady.Api.Migrations
{
    /// <inheritdoc />
    public partial class RaiseMinimumWorkMinutes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences");

            // A row written under the old bound would fail the new constraint, so
            // it is raised to the shortest focus session the app now offers.
            migrationBuilder.Sql(
                "UPDATE timer_preferences SET work_minutes = 30 WHERE work_minutes < 30;");

            migrationBuilder.AddCheckConstraint(
                name: "ck_timer_preferences_work_minutes",
                table: "timer_preferences",
                sql: "work_minutes between 30 and 120");
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
                sql: "work_minutes between 5 and 120");
        }
    }
}
