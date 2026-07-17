using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTable_Stocks_to_Stock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Stocks",
                schema: "identity",
                table: "Stocks");

            migrationBuilder.RenameTable(
                name: "Stocks",
                schema: "identity",
                newName: "Stock",
                newSchema: "identity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stock",
                schema: "identity",
                table: "Stock",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Stock",
                schema: "identity",
                table: "Stock");

            migrationBuilder.RenameTable(
                name: "Stock",
                schema: "identity",
                newName: "Stocks",
                newSchema: "identity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stocks",
                schema: "identity",
                table: "Stocks",
                column: "Id");
        }
    }
}
