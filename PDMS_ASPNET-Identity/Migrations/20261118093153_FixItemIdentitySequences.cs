using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class FixItemIdentitySequences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnedItems_Deliveries_ShipmentId",
                schema: "identity",
                table: "ReturnedItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShipmentItems_Deliveries_ShipmentId",
                schema: "identity",
                table: "ShipmentItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Deliveries",
                schema: "identity",
                table: "Deliveries");

            migrationBuilder.RenameTable(
                name: "Deliveries",
                schema: "identity",
                newName: "Shipments",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Deliveries_RegisterNumber",
                schema: "identity",
                table: "Shipments",
                newName: "IX_Shipments_RegisterNumber");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shipments",
                schema: "identity",
                table: "Shipments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnedItems_Shipments_ShipmentId",
                schema: "identity",
                table: "ReturnedItems",
                column: "ShipmentId",
                principalSchema: "identity",
                principalTable: "Shipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ShipmentItems_Shipments_ShipmentId",
                schema: "identity",
                table: "ShipmentItems",
                column: "ShipmentId",
                principalSchema: "identity",
                principalTable: "Shipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnedItems_Shipments_ShipmentId",
                schema: "identity",
                table: "ReturnedItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShipmentItems_Shipments_ShipmentId",
                schema: "identity",
                table: "ShipmentItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shipments",
                schema: "identity",
                table: "Shipments");

            migrationBuilder.RenameTable(
                name: "Shipments",
                schema: "identity",
                newName: "Deliveries",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Shipments_RegisterNumber",
                schema: "identity",
                table: "Deliveries",
                newName: "IX_Deliveries_RegisterNumber");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Deliveries",
                schema: "identity",
                table: "Deliveries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnedItems_Deliveries_ShipmentId",
                schema: "identity",
                table: "ReturnedItems",
                column: "ShipmentId",
                principalSchema: "identity",
                principalTable: "Deliveries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ShipmentItems_Deliveries_ShipmentId",
                schema: "identity",
                table: "ShipmentItems",
                column: "ShipmentId",
                principalSchema: "identity",
                principalTable: "Deliveries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
