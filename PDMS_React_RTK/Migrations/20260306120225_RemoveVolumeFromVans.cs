using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDMS.Migrations
{
    /// <inheritdoc />
    public partial class RemoveVolumeFromVans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxVolumeM3",
                schema: "identity",
                table: "Vans");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MaxVolumeM3",
                schema: "identity",
                table: "Vans",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
