using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class valvetypechanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "image",
                table: "ValveCodes",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image",
                table: "ValveCodes");
        }
    }
}
