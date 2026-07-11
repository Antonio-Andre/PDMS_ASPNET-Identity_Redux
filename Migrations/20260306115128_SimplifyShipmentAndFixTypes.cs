 using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyShipmentAndFixTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Item",
                schema: "identity",
                table: "Deliveries");

            migrationBuilder.RenameColumn(
                name: "WeightKg",
                schema: "identity",
                table: "Deliveries",
                newName: "TotalShipmentWeightKg");

            migrationBuilder.AddColumn<int>(
                name: "DriverId",
                schema: "identity",
                table: "Deliveries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SLAExpiration",
                schema: "identity",
                table: "Deliveries",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "VanId",
                schema: "identity",
                table: "Deliveries",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ShipmentItems",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BatchNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Product = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ShipmentId = table.Column<int>(type: "int", nullable: false),
                    ItemWeightKg = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShipmentItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShipmentItems_Deliveries_ShipmentId",
                        column: x => x.ShipmentId,
                        principalSchema: "identity",
                        principalTable: "Deliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShipmentItems_ShipmentId",
                schema: "identity",
                table: "ShipmentItems",
                column: "ShipmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShipmentItems",
                schema: "identity");

            migrationBuilder.DropColumn(
                name: "DriverId",
                schema: "identity",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "SLAExpiration",
                schema: "identity",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "VanId",
                schema: "identity",
                table: "Deliveries");

            migrationBuilder.RenameColumn(
                name: "TotalShipmentWeightKg",
                schema: "identity",
                table: "Deliveries",
                newName: "WeightKg");

            migrationBuilder.AddColumn<string>(
                name: "Item",
                schema: "identity",
                table: "Deliveries",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
