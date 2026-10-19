import { useState } from "react";
import type { Shipment } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  shipments: Shipment[];
  isLoading: boolean;
  onConfirmDelivery?: (id: string | number) => void;
}

type SortColumn = "movement" | "Weight" | null;
type SortDirection = "asc" | "desc";

export const ShipmentsView = ({
  shipments,
  isLoading,
  onConfirmDelivery,
}: Props) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [confirmingDeliveryId, setConfirmingDeliveryId] = useState<
    string | number | null
  >(null);

  if (isLoading) return <h2>A carregar dados de remessas do PDMS...</h2>;
  if (shipments.length === 0) return <h2>Nenhuma remessa encontrada.</h2>;

  const handleConfirmAction = (id: string | number) => {
    if (onConfirmDelivery) {
      onConfirmDelivery(id);
    }
    setConfirmingDeliveryId(null);
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesStatus;
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (!sortColumn) return 0;

    if (sortColumn === "movement") {
      return sortDirection === "asc"
        ? a.movement.localeCompare(b.movement)
        : b.movement.localeCompare(a.movement);
    }

    if (sortColumn === "Weight") {
      return sortDirection === "asc"
        ? a.totalShipmentWeightKg - b.totalShipmentWeightKg
        : b.totalShipmentWeightKg - a.totalShipmentWeightKg;
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
        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>⬇ ⌸</span>
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
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ padding: "20px", width: "100%", boxSizing: "border-box" }}>
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

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f9f9f9" }}>
            <th style={{ ...tableHeaderStyle, width: "18%" }}>ID</th>
            <th style={{ ...tableHeaderStyle, width: "18%" }}>status</th>

            <th
              style={{ ...headerClickableStyle, width: "22%" }}
              onClick={() => handleSort("movement")}
            >
              movement Type {renderSortIcon("movement")}
            </th>

            <th
              style={{ ...headerClickableStyle, width: "18%" }}
              onClick={() => handleSort("Weight")}
            >
              Weight (kg) {renderSortIcon("Weight")}
            </th>

            <th style={{ ...tableHeaderStyle, width: "12%" }}>Details</th>
            <th
              style={{
                ...tableHeaderStyle,
                width: "180px", // Espaço suficiente sem folga gigante
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              Actions
            </th>
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
                <td style={cellStyle}>{s.totalShipmentWeightKg} kg</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => navigate(`/shipment/${s.id}`)}
                    style={viewButtonStyle}
                  >
                    View List
                  </button>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "8px",
                    }}
                  >
                    {confirmingDeliveryId === s.id ? (
                      <span
                        style={{
                          display: "inline-flex",
                          gap: "6px",
                          marginRight: "2px",
                        }}
                      >
                        <button
                          onClick={() => handleConfirmAction(s.id)}
                          title="Confirmar Entrega"
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: "#e6ffe6",
                            borderColor: "#28a745",
                          }}
                        >
                          ✔️
                        </button>
                        <button
                          onClick={() => setConfirmingDeliveryId(null)}
                          title="Cancelar"
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: "#ffe6e6",
                            borderColor: "#dc3545",
                          }}
                        >
                          ❌
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingDeliveryId(s.id)}
                        style={confirmDeliveryButtonStyle}
                      >
                        Confirm Delivery
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
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

// Estilos dos Botões
const viewButtonStyle: React.CSSProperties = {
  cursor: "pointer",
  padding: "5px 10px",
  backgroundColor: "transparent",
  border: "1px solid #007bff",
  color: "#007bff",
  borderRadius: "4px",
};

const confirmDeliveryButtonStyle: React.CSSProperties = {
  cursor: "pointer",
  padding: "5px 10px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontWeight: "500",
};

const actionButtonStyle: React.CSSProperties = {
  background: "#f8f9fa",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  padding: "4px 8px",
};
