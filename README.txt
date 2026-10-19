#Internal Distribution & Inventory Management System 

An internal back-office system focused on physical warehouse management, atomic SKU transformation (Kitting), and minimalist fleet logistics. Engineered with a **.NET API (EF Core)** backend and a **React (Redux Toolkit)** frontend.

This software contains no public-facing storefronts, e-commerce layers, shipping rate calculators, or geospatial routing engines.

## 🚀 Quick Start

### Prerequisites
* .NET SDK (v8.0+)
* Node.js (v20+)
* Docker (for local database instance)

### Backend Setup (.NET)
```bash
cd backend/WmsAPI
docker-compose up -d
dotnet ef database update
dotnet run
```

2. Frontend Setup (React)
   cd PDMS_React_RTK
   npm install
   npm run start

## Repository Branches

- main: Stable full-stack application.
- staging_branch: Integration branch for ongoing full-stack development.
- independent_MockFrontend: Standalone frontend demo running strictly on local mock data.