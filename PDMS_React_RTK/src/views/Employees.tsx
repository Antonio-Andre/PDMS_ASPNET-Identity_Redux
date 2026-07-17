import { useState } from "react";
import type { Employee } from "../types";

export const EmployeesView = ({
  employees,
  isLoading,
}: {
  employees: Employee[];
  isLoading: boolean;
}) => {
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

  if (isLoading) return <h2>A carregar funcionários do PDMS...</h2>;
  if (employees.length === 0) return <h2>Nenhum funcionário encontrado.</h2>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h2>Lista de Funcionários</h2>
      <table
        style={{ width: "80%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th
              onClick={() => requestSort("name")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Nome ↕
            </th>
            <th
              onClick={() => requestSort("jobTitle")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Cargo ↕
            </th>
            <th
              onClick={() => requestSort("status")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Status ↕
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{emp.name}</td>
              <td style={{ padding: "10px" }}>{emp.jobTitle}</td>
              <td style={{ padding: "10px" }}>
                <span
                  style={{
                    padding: "2px 5px",
                    backgroundColor:
                      emp.status === "Active" ? "#d4edda" : "#f8d7da",
                  }}
                >
                  {emp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
