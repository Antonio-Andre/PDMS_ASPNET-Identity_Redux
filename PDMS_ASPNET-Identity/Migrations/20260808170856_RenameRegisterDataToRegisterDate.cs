using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class RenameRegisterDataToRegisterDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RegisterData",
                schema: "identity",
                table: "Deliveries",
                newName: "RegisterDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RegisterDate",
                schema: "identity",
                table: "Deliveries",
                newName: "RegisterData");
        }
    }
}
