# PDMS - Platform Data Management System

Full-stack back-office application designed for physical warehouse management, stock tracking, and fleet operations.

## Tech Stack

- Backend: C# / .NET 8, ASP.NET Core Web API, Entity Framework Core
- Frontend: React, Redux Toolkit (RTK)
- Database: SQL Server / EF Core Migrations

## Project Structure

- PDMS_ASPNET-Identity/: REST API backend handling business logic, identity/auth, and data persistence.
- PDMS_React_RTK/: React frontend UI integrated with Redux Toolkit for state management.

## How to Run

1. Backend Setup (.NET)
   cd PDMS_ASPNET-Identity
   dotnet ef database update
   dotnet run

2. Frontend Setup (React)
   cd PDMS_React_RTK
   npm install
   npm run start

## Repository Branches

- main: Stable full-stack application.
- staging_branch: Integration branch for ongoing full-stack development.
- independent_MockFrontend: Standalone frontend demo running strictly on local mock data.