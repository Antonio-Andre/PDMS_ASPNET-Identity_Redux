import { Link } from "react-router-dom";
import type { Shipment } from "../types";

const getMovementColor = (move: Shipment["movement"]) => {
  if (move === "Inbound") {
    return "#3498db";
  }
  if (move === "Outbound") {
    return "#f1c40f";
  }
  return "#e0e0e0";
};

export const ShipmentCard = ({ shipment }: { shipment: Shipment }) => {
  const barColor = getMovementColor(shipment.movement);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "0 15px 15px 15px",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          backgroundColor: barColor,
          height: "10px",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      <div style={{ marginTop: "15px" }}>
        <h4 style={{ margin: "0 0 5px 0" }}>{shipment.registerNumber}</h4>

        <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
          📦 {shipment.status}
        </p>

        <p style={{ margin: 0, fontWeight: "bold", color: barColor }}>
          {shipment.movement === "Inbound"
            ? "⬇️ Comming In..."
            : "Going Out!⬆️"}
        </p>

        <div
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#f1f3f5",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>⚖️</span>
          <span style={{ fontWeight: "bold", color: "#495057" }}>
            {shipment.TotalShipmentWeightKg} kg
          </span>
        </div>
      </div>

      <Link
        to={`/shipment/${shipment.id}`}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e9ecef";
          e.currentTarget.style.borderColor = "#ced4da";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
          e.currentTarget.style.borderColor = "#dee2e6";
        }}
      >
        📋 View items List
      </Link>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "8px 16px",
  backgroundColor: "#f8f9fa",
  color: "#495057",
  border: "1px solid #dee2e6",
  borderRadius: "6px",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  textDecoration: "none",
  boxSizing: "border-box",
  textAlign: "center",
};
