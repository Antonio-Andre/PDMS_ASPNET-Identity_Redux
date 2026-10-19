import { useState } from "react";
import type { Company } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  companies: Company[];
  isLoading: boolean;
  onDeleteCompany?: (id: string | number) => void;
}

export const CompaniesView = ({
  companies,
  isLoading,
  onDeleteCompany,
}: Props) => {
  const userRole = "Admin";
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleConfirmDelete = (id: string | number) => {
    if (onDeleteCompany) {
      onDeleteCompany(id);
    }
    setDeletingId(null);
  };

  if (isLoading) return <h2>A carregar empresas do PDMS...</h2>;

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Gestão de Empresas</h2>
        {userRole === "Admin" && (
          <button
            onClick={() => navigate("/company/new")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Nova Empresa
          </button>
        )}
      </div>
      {companies.length === 0 ? (
        <h2>Nenhuma empresa encontrada.</h2>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ ...tableHeaderStyle, width: "18%" }}>name</th>
              <th style={{ ...tableHeaderStyle, width: "22%" }}>
                Street Adress
              </th>
              <th style={{ ...tableHeaderStyle, width: "10%" }}>ZIP Code</th>
              <th style={{ ...tableHeaderStyle, width: "15%" }}>location</th>
              <th style={{ ...tableHeaderStyle, width: "18%" }}>email</th>
              <th style={{ ...tableHeaderStyle, width: "12%" }}>
                Phone Number
              </th>
              {userRole === "Admin" && (
                <th
                  style={{
                    ...tableHeaderStyle,
                    width: "160px", // Largura ampliada para caberem todos os botões estendidos
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tableCellStyle}>{c.name}</td>
                <td style={tableCellStyle}>{c.streetAdress}</td>
                <td style={tableCellStyle}>{c.postalCode}</td>
                <td style={tableCellStyle}>{c.location}</td>
                <td style={tableCellStyle}>{c.email}</td>
                <td style={tableCellStyle}>{c.phoneNumber}</td>
                {userRole === "Admin" && (
                  <td
                    style={{
                      ...actionCellStyle,
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
                      <button
                        style={editButtonStyle}
                        onClick={() => navigate("/company/edit/" + c.id)}
                      >
                        Edit Info
                      </button>

                      {deletingId === c.id ? (
                        /* Modo estendido: 2px de margem à direita conforme solicitado */
                        <span
                          style={{
                            display: "inline-flex",
                            gap: "6px",
                            marginRight: "2px", // 2px de margem no estado estendido
                          }}
                        >
                          <button
                            onClick={() => handleConfirmDelete(c.id)}
                            title="Confirmar"
                            style={{
                              ...actionButtonStyle,
                              backgroundColor: "#e6ffe6",
                              borderColor: "#28a745",
                            }}
                          >
                            ✔️
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
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
                          onClick={() => setDeletingId(c.id)}
                          title="Eliminar"
                          style={actionButtonStyle}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Estilos
const tableHeaderStyle = { padding: "12px", borderBottom: "2px solid #ddd" };

const tableCellStyle = {
  padding: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

// Célula específica de ações sem o overflow:hidden para não cortar botões
const actionCellStyle = {
  padding: "12px",
  whiteSpace: "nowrap",
};

const editButtonStyle = {
  color: "#007bff",
  backgroundColor: "transparent",
  border: "1px solid #007bff",
  borderRadius: "4px",
  padding: "4px 10px",
  cursor: "pointer",
};

const actionButtonStyle = {
  background: "#f8f9fa",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  padding: "4px 8px",
};
