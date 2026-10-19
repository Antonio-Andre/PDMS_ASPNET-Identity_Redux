import React from "react";
import { useNavigate } from "react-router-dom";

interface UnderConstructionViewProps {
  resourceName: string; // Ex: "Van" ou "Employee"
}

export const UnderConstructionView: React.FC<UnderConstructionViewProps> = ({
  resourceName,
}) => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🚧</div>

        <h2 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
          Create New {resourceName}
        </h2>

        <p style={{ color: "#666", marginBottom: "25px", fontSize: "0.95rem" }}>
          This feature is currently under construction. Please check back later!
        </p>

        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          ← Go Back
        </button>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
  padding: "20px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "450px",
  width: "100%",
  padding: "40px 30px",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  textAlign: "center",
};

const backButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
};
