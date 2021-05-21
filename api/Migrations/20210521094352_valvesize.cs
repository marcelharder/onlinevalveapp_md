using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class valvesize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ValveCodes",
                table: "ValveCodes");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ValveCodes");

            migrationBuilder.DropColumn(
                name: "Valve_size",
                table: "ValveCodes");

            migrationBuilder.AddColumn<int>(
                name: "ValveTypeId",
                table: "ValveCodes",
                nullable: false,
                defaultValue: 0)
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ValveCodes",
                table: "ValveCodes",
                column: "ValveTypeId");

            migrationBuilder.CreateTable(
                name: "Valve_sizes",
                columns: table => new
                {
                    SizeId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Size = table.Column<int>(nullable: false),
                    EOA = table.Column<float>(nullable: false),
                    VTValveTypeId = table.Column<int>(nullable: true),
                    ValveTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Valve_sizes", x => x.SizeId);
                    table.ForeignKey(
                        name: "FK_Valve_sizes_ValveCodes_VTValveTypeId",
                        column: x => x.VTValveTypeId,
                        principalTable: "ValveCodes",
                        principalColumn: "ValveTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Valve_sizes_VTValveTypeId",
                table: "Valve_sizes",
                column: "VTValveTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Valve_sizes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ValveCodes",
                table: "ValveCodes");

            migrationBuilder.DropColumn(
                name: "ValveTypeId",
                table: "ValveCodes");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ValveCodes",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<string>(
                name: "Valve_size",
                table: "ValveCodes",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ValveCodes",
                table: "ValveCodes",
                column: "Id");
        }
    }
}
