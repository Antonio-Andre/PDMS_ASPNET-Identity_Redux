import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Van } from "../types";

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

interface VansViewProps {
  vans: Van[];
  isLoading: boolean;
  onAssign: (regNumber: string, vanId: number) => void;
  onBuyVan?: () => void;
  onSellVan?: (id: number) => void;
}

export const VansView = ({
  vans,
  isLoading,
  onAssign,
  onBuyVan,
  onSellVan,
}: VansViewProps) => {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState("");
  const [selectedVanId, setSelectedVanId] = useState("");
  const [sellingVanId, setSellingVanId] = useState<number | null>(null);

  const availableVans = vans.filter((v) => v.status === "Available");
  const unavailableVans = vans.filter((v) => v.status !== "Available");

  const handleConfirmSell = (id: number) => {
    if (onSellVan) {
      onSellVan(id);
    }
    setSellingVanId(null);
  };

  const handleBuyClick = () => {
    if (onBuyVan) {
      onBuyVan();
    } else {
      navigate("/van/new");
    }
  };

  const renderVanItem = (van: Van) => (
    <div key={van.id} style={cardStyle}>
      <span style={{ marginRight: "15px", fontSize: "1.5em" }}>🚚</span>
      <div>
        <strong style={{ fontSize: "1.1em", display: "block" }}>
          {van.licensePlate}
        </strong>
        <span style={{ fontSize: "0.9em", color: "#666" }}>
          {van.maxLoadKg}kg • Inspected on {van.dataOfInspection}
        </span>
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={badgeStyle(van.status)}>{van.status}</span>

        {/* Container ancorado à esquerda para alinhar as bordas esquerdas do "Sell" e do "✔️" */}
        <div
          style={{
            minWidth: "90px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {sellingVanId === van.id ? (
            <span
              style={{
                display: "inline-flex",
                gap: "6px",
              }}
            >
              <button
                onClick={() => handleConfirmSell(van.id)}
                title="Confirm Sale"
                style={confirmButtonStyle}
              >
                ✔️
              </button>
              <button
                onClick={() => setSellingVanId(null)}
                title="Cancel"
                style={cancelButtonStyle}
              >
                ❌
              </button>
            </span>
          ) : (
            <button
              onClick={() => setSellingVanId(van.id)}
              style={sellButtonStyle}
            >
              Sell
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0 }}>Fleet Management (Vans)</h2>
        <button onClick={handleBuyClick} style={buyButtonStyle}>
          + Buy Van
        </button>
      </div>

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
          placeholder="Order code..."
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
          <option value="">Select a van...</option>
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
          Assign
        </button>
      </div>

      {isLoading ? (
        <p style={{ textAlign: "center" }}>Loading data...</p>
      ) : (
        <>
          <h3>Available Vans</h3>
          {availableVans.map(renderVanItem)}

          <h3 style={{ marginTop: "40px" }}>Unavailable / Maintenance</h3>
          {unavailableVans.map(renderVanItem)}
        </>
      )}
    </div>
  );
};

// Estilos dos Botões
const buyButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const sellButtonStyle: React.CSSProperties = {
  padding: "5px 14px",
  backgroundColor: "transparent",
  border: "1px solid #dc3545",
  color: "#dc3545",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85em",
  fontWeight: 600,
};

const confirmButtonStyle: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#e6ffe6",
  border: "1px solid #28a745",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#ffe6e6",
  border: "1px solid #dc3545",
  borderRadius: "4px",
  cursor: "pointer",
};
