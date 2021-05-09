using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class TFDAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TFD",
                table: "Valves",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TFD",
                table: "Valves");
        }
    }
}
