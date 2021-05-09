using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "TFD",
                table: "Valves",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "TFD",
                table: "Valves",
                type: "float",
                nullable: false,
                oldClrType: typeof(double));
        }
    }
}
