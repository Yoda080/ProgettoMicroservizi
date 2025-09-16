using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentalService.Migrations
{
    public partial class AddMissingColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rentals')
                BEGIN
                    CREATE TABLE [dbo].[rentals] (
                        [Id] int NOT NULL IDENTITY,
                        [user_id] int NOT NULL,
                        [movie_id] int NOT NULL,
                        [rented_at] datetime2 NOT NULL,
                        [due_date] datetime2 NOT NULL,
                        [returned_at] datetime2 NULL,
                        [total_price] decimal(10,2) NOT NULL,
                        CONSTRAINT [PK_rentals] PRIMARY KEY ([Id])
                    );
                END
                ELSE
                BEGIN
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'rentals' AND COLUMN_NAME = 'returned_at')
                    BEGIN
                        ALTER TABLE rentals ADD returned_at datetime2 NULL;
                    END
                    
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'rentals' AND COLUMN_NAME = 'total_price')
                    BEGIN
                        ALTER TABLE rentals ADD total_price decimal(10,2) NOT NULL DEFAULT 0;
                    END
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rentals')
                BEGIN
                    DROP TABLE [dbo].[rentals];
                END
            ");
        }
    }
}