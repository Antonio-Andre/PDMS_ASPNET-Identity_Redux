using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class statustoStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status",
                schema: "identity",
                table: "Deliveries",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                schema: "identity",
                table: "Deliveries",
                newName: "status");
        }
    }
}
