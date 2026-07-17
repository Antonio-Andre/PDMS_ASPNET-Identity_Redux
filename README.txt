# Internal OMS/WMS & Fleet State Orchestrator

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

### Frontend Setup (React + RTK)
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
cd backend/WmsAPI.Tests
dotnet test
```

## ⚙️ Fleet Finite State Machine (FSM)

The operational state of vehicles and cargo manifests is managed through strict, deterministic state transitions:

```mermaid
graph LR
    IDLE([IDLE]) --> LOADING[LOADING]
    LOADING --> LOADED[LOADED]
    LOADING --> IDLE
    LOADED --> OUT_FOR_DELIVERY[OUT_FOR_DELIVERY]
    OUT_FOR_DELIVERY --> DELIVERED[DELIVERED]
    DELIVERED --> RETURNING[RETURNING]
    RETURNING --> IDLE
```

*For a detailed look into the architectural patterns, design decisions, and EF Core/RTK implementations, see [ARCHITECTURE.md](./ARCHITECTURE.md).*
