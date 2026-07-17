import { useState } from "react";
import type { Shipment } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  shipments: Shipment[];
  isLoading: boolean;
}

type SortColumn = "movement" | "Weight" | null;
type SortDirection = "asc" | "desc";

export const ShipmentsView = ({ shipments, isLoading }: Props) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  if (isLoading) return <h2>A carregar dados de remessas do PDMS...</h2>;
  if (shipments.length === 0) return <h2>Nenhuma remessa encontrada.</h2>;

  const filteredShipments = shipments.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesStatus;
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (!sortColumn) return 0; // Sem ordenação ativa

    if (sortColumn === "movement") {
      return sortDirection === "asc"
        ? a.movement.localeCompare(b.movement)
        : b.movement.localeCompare(a.movement);
    }

    if (sortColumn === "Weight") {
      return sortDirection === "asc"
        ? a.TotalShipmentWeightKg - b.TotalShipmentWeightKg
        : b.TotalShipmentWeightKg - a.TotalShipmentWeightKg;
    }

    return 0;
  });

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column)
      return <span style={{ marginLeft: "5px", color: "#ccc" }}>⇅</span>;
    if (column === "Weight") {
      return sortDirection === "asc" ? (
        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>⬇ ⌸</span> // Menor no topo, maior no fundo
      ) : (
        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>⬆ ⌸</span>
      );
    }

    return sortDirection === "asc" ? " 🔼" : " 🔽";
  };

  const headerClickableStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    color: "#333",
    cursor: "pointer",
    userSelect: "none",
  };

  const tableHeaderStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    color: "#333",
  };

  const cellStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #eee",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shipment Flow Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>
            status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "6px", borderRadius: "4px" }}
          >
            <option value="All">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Pending">Pending</option>
            <option value="Loaded">Loaded</option>
            <option value="InTransit">InTransit</option>
            <option value="Delivered">Delivered</option>
            <option value="FailedDelivery">FailedDelivery</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <span>
            Inbound:{" "}
            <strong
              style={{
                border: "2px solid #f1c40f",
                padding: "2px 8px",
                borderRadius: "15px",
              }}
            >
              {sortedShipments.filter((s) => s.movement === "Inbound").length}
            </strong>
          </span>

          <span>
            Outbound:{" "}
            <strong
              style={{
                border: "2px solid #3498db",
                padding: "2px 8px",
                borderRadius: "15px",
              }}
            >
              {sortedShipments.filter((s) => s.movement === "Outbound").length}
            </strong>
          </span>
        </div>

        <span style={{ color: "#666", fontSize: "14px", marginLeft: "auto" }}>
          Showing {sortedShipments.length} of {shipments.length} orders
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f9f9f9" }}>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>status</th>

            <th
              style={headerClickableStyle}
              onClick={() => handleSort("movement")}
            >
              movement Type {renderSortIcon("movement")}
            </th>

            <th
              style={headerClickableStyle}
              onClick={() => handleSort("Weight")}
            >
              Weight (kg) {renderSortIcon("Weight")}
            </th>

            <th style={tableHeaderStyle}>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedShipments.length > 0 ? (
            sortedShipments.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={cellStyle}>{s.registerNumber}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#eef",
                      fontSize: "14px",
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td style={cellStyle}>
                  <strong>{s.movement}</strong>
                </td>
                <td style={cellStyle}>{s.TotalShipmentWeightKg} kg</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => navigate(`/shipment/${s.id}`)}
                    //onClick={() => navigate("/shipment/" + s.id)}
                    style={{ cursor: "pointer", padding: "5px 10px" }}
                  >
                    View List
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                style={{
                  ...cellStyle,
                  textAlign: "center",
                  color: "#999",
                  padding: "30px",
                }}
              >
                No shipments found matching the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
