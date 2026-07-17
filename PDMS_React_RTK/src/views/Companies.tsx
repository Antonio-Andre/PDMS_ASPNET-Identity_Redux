import type { Company } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  companies: Company[];
  isLoading: boolean;
}

export const CompaniesView = ({ companies, isLoading }: Props) => {
  //const userRole = "Admin";
  const userRole = " ";
  const navigate = useNavigate();

  if (isLoading) return <h2>A carregar empresas do PDMS...</h2>;
  if (companies.length === 0) return <h2>Nenhuma empresa encontrada.</h2>;

  return (
    <div>
      <h2>Gestão de Empresas</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={tableHeaderStyle}>name</th>
            <th style={tableHeaderStyle}>Street Adress</th>
            <th style={tableHeaderStyle}>ZIP Code</th>
            <th style={tableHeaderStyle}>location</th>
            <th style={tableHeaderStyle}>email</th>
            <th style={tableHeaderStyle}>Phone Number</th>
            {userRole === "Admin" && <th style={tableHeaderStyle}>✏️</th>}
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
                <td style={tableCellStyle}>
                  <button
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => navigate("/company/edit/" + c.id)}
                  >
                    Edit Info
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tableCellStyle = { padding: "12px" };
