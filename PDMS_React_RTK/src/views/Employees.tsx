import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types";

interface EmployeesViewProps {
  employees: Employee[];
  isLoading: boolean;
  onHireEmployee?: () => void;
  onTerminateEmployee?: (id: string | number) => void;
}

export const EmployeesView = ({
  employees,
  isLoading,
  onHireEmployee,
  onTerminateEmployee,
}: EmployeesViewProps) => {
  const navigate = useNavigate();
  const [terminatingId, setTerminatingId] = useState<string | number | null>(
    null,
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key]! < b[sortConfig.key]!)
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key]! > b[sortConfig.key]!)
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Employee) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleConfirmTerminate = (id: string | number) => {
    if (onTerminateEmployee) {
      onTerminateEmployee(id);
    }
    setTerminatingId(null);
  };

  const handleHireClick = () => {
    if (onHireEmployee) {
      onHireEmployee();
    } else {
      navigate("/employee/new");
    }
  };

  if (isLoading) return <h2>Loading employees data...</h2>;

  return (
    <div style={{ width: "100%", padding: "20px", boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Employee Directory</h2>
        <button onClick={handleHireClick} style={hireButtonStyle}>
          + Hire Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <h2>No employees found.</h2>
      ) : (
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
            <tr style={{ backgroundColor: "#f9f9f9", textAlign: "left" }}>
              <th
                onClick={() => requestSort("name")}
                style={{ ...headerClickableStyle, width: "35%" }}
              >
                Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : "⇅"}
              </th>
              <th
                onClick={() => requestSort("jobTitle")}
                style={{ ...headerClickableStyle, width: "30%" }}
              >
                Job Title{" "}
                {sortConfig.key === "jobTitle"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : "⇅"}
              </th>
              <th
                onClick={() => requestSort("status")}
                style={{ ...headerClickableStyle, width: "20%" }}
              >
                Status{" "}
                {sortConfig.key === "status"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : "⇅"}
              </th>
              <th
                style={{
                  ...tableHeaderStyle,
                  width: "140px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((emp) => {
              const isAdmin =
                emp.jobTitle?.toLowerCase() === "admin" ||
                emp.name?.toLowerCase().includes("admin");

              return (
                <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={cellStyle}>{emp.name}</td>
                  <td style={cellStyle}>{emp.jobTitle}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        backgroundColor:
                          emp.status === "Active" ? "#d4edda" : "#f8d7da",
                        color: emp.status === "Active" ? "#155724" : "#721c24",
                      }}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "110px",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      {isAdmin ? (
                        <span style={disabledTextStyle}>Protected</span>
                      ) : terminatingId === emp.id ? (
                        <span
                          style={{
                            display: "inline-flex",
                            gap: "6px",
                          }}
                        >
                          <button
                            onClick={() => handleConfirmTerminate(emp.id)}
                            title="Confirm Termination"
                            style={confirmButtonStyle}
                          >
                            ✔️
                          </button>
                          <button
                            onClick={() => setTerminatingId(null)}
                            title="Cancel"
                            style={cancelButtonStyle}
                          >
                            ❌
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setTerminatingId(emp.id)}
                          style={terminateButtonStyle}
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Estilos de Tabela e Botões
const tableHeaderStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#333",
};

const headerClickableStyle: React.CSSProperties = {
  ...tableHeaderStyle,
  cursor: "pointer",
  userSelect: "none",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const hireButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const terminateButtonStyle: React.CSSProperties = {
  padding: "5px 12px",
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

const disabledTextStyle: React.CSSProperties = {
  fontSize: "0.85em",
  color: "#888",
  fontStyle: "italic",
};
