import React from "react";
import type { Van } from "../types";

// --- Estilos ---
const cardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "16px 20px",
  margin: "12px 0",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const badgeStyle = (status: string): React.CSSProperties => ({
  marginLeft: "auto",
  fontSize: "0.8em",
  padding: "5px 12px",
  borderRadius: "20px",
  fontWeight: 600,
  backgroundColor:
    status === "Available"
      ? "#d4edda"
      : status === "Loading"
        ? "#fff3cd"
        : "#d1d1d1",
});

export const VansView = ({
  vans,
  isLoading,
  onAssign,
}: {
  vans: Van[];
  isLoading: boolean;
  onAssign: (regNumber: string, vanId: number) => void;
}) => {
  const [regNumber, setRegNumber] = React.useState("");
  const [selectedVanId, setSelectedVanId] = React.useState("");

  const availableVans = vans.filter((v) => v.status === "Available");
  const unavailableVans = vans.filter((v) => v.status !== "Available");

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Gestão de Frota (Vans)
      </h2>

      <div
        style={{
          padding: "25px",
          border: "1px solid #d1d9e6",
          borderRadius: "12px",
          marginBottom: "40px",
          backgroundColor: "#f8f9fa",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
          placeholder="Código de encomenda..."
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />

        <select
          value={selectedVanId}
          onChange={(e) => setSelectedVanId(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Selecione uma carrinha...</option>
          {availableVans.map((v) => (
            <option key={v.id} value={v.id}>
              {v.licensePlate} ({v.maxLoadKg}kg)
            </option>
          ))}
        </select>

        <button
          onClick={() => onAssign(regNumber, Number(selectedVanId))}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3a5a78",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Atribuir
        </button>
      </div>

      {isLoading ? (
        <p style={{ textAlign: "center" }}>A carregar dados...</p>
      ) : (
        <>
          <h3>Disponíveis</h3>
          {availableVans.map(renderVanItem)}

          <h3 style={{ marginTop: "40px" }}>Indisponíveis / Manutenção</h3>
          {unavailableVans.map(renderVanItem)}
        </>
      )}
    </div>
  );
};

// --- Helper Render ---
const renderVanItem = (van: Van) => (
  <div key={van.id} style={cardStyle}>
    <span style={{ marginRight: "15px", fontSize: "1.5em" }}>🚚</span>
    <div>
      <strong style={{ fontSize: "1.1em", display: "block" }}>
        {van.licensePlate}
      </strong>
      <span style={{ fontSize: "0.9em", color: "#666" }}>
        {van.maxLoadKg}kg • Inspecionada em {van.dataOfInspection}
      </span>
    </div>
    <span style={badgeStyle(van.status)}>{van.status}</span>
  </div>
);
