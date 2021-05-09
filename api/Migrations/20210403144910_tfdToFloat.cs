using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class tfdToFloat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "TFD",
                table: "Valves",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TFD",
                table: "Valves",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(float));
        }
    }
}
