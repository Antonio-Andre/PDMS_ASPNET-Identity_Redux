using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class AddSupportforCoords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "QuantityDelivered",
                schema: "identity",
                table: "ShipmentItems",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                schema: "identity",
                table: "ShipmentItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ReturnedItems",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BatchNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantityReturned = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReturnedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ShipmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReturnedItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReturnedItems_Deliveries_ShipmentId",
                        column: x => x.ShipmentId,
                        principalSchema: "identity",
                        principalTable: "Deliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReturnedItems_ShipmentId",
                schema: "identity",
                table: "ReturnedItems",
                column: "ShipmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReturnedItems",
                schema: "identity");

            migrationBuilder.DropColumn(
                name: "QuantityDelivered",
                schema: "identity",
                table: "ShipmentItems");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "identity",
                table: "ShipmentItems");
        }
    }
}
