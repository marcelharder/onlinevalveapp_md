using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class patchsize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PatchSize",
                table: "Valves",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PatchSize",
                table: "Valves");
        }
    }
}
