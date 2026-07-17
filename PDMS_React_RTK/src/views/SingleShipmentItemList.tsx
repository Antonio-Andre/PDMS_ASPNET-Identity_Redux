import { useParams, useNavigate } from "react-router-dom";
import type { Shipment, ShipmentItem } from "../types";

interface ItemProps {
  shipments: Shipment[];
}

export const SingleShipmentItemList = ({ shipments }: ItemProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const activeShipment = shipments.find(
    (s) => String(s.id).toLowerCase() === id?.toLowerCase(),
  );

  if (!activeShipment) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Remessa "{id}" não encontrada ou ainda a carregar...</h3>
        <button onClick={() => navigate("/shipments")}>
          Voltar para a Lista
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "2px solid #333",
        borderRadius: "6px",
        padding: "15px",
        marginTop: "30px",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3 style={{ margin: 0 }}>items for {activeShipment.registerNumber}</h3>
        <button
          onClick={() => navigate("/shipments")}
          style={{
            cursor: "pointer",
            padding: "4px 8px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          Voltar para a Lista
        </button>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #ddd",
            }}
          >
            <th style={{ padding: "10px" }}>product</th>
            <th style={{ padding: "10px" }}>quantity</th>
            <th style={{ padding: "10px" }}>unit Weight</th>
            <th style={{ padding: "10px" }}>Total Weight</th>
          </tr>
        </thead>
        <tbody>
          {activeShipment.items?.map((item: ShipmentItem) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{item.product}</td>
              <td style={{ padding: "10px" }}>{item.quantity}</td>
              <td style={{ padding: "10px" }}>
                {item.itemWeightKg !== undefined
                  ? `${item.itemWeightKg} kg`
                  : "n/a"}
              </td>
              <td style={{ padding: "10px" }}>
                {item.itemWeightKg !== undefined
                  ? `${(item.quantity * item.itemWeightKg).toFixed(1)} Kg`
                  : "N/A Kg"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
