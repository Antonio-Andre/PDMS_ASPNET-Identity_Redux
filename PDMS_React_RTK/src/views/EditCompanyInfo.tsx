import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { updateCompany } from "../store/features/companySlice";
import { useParams, useNavigate } from "react-router-dom";
import type { Company } from "../types";
import { TextInput } from "../components/TextInput"; // Ajusta o caminho para onde guardaste o TextInput

interface EditCompanyProps {
  companies: Company[];
}

export const EditCompanyInfo = ({ companies }: EditCompanyProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const originalCompany = companies.find((c) => String(c.id) === id);

  const [company, setCompany] = useState<Company>(() => {
    return (
      originalCompany || {
        id: 0,
        name: "",
        taxId: "",
        streetAdress: "",
        postalCode: "",
        location: "",
        email: "",
        phoneNumber: "",
        shareCapital: 0,
      }
    );
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: name === "shareCapital" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    console.log("Objeto a enviar para a API:", company);
    console.log("Tipo do id:", typeof company.id);
    try {
      await dispatch(updateCompany(company));
      alert("Guardado com sucesso!");
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Falha ao guardar: " + err);
    } finally {
      navigate("/companies");
    }
  };

  if (!originalCompany) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Empresa "{id}" não encontrada.</h3>
        <button onClick={() => navigate("/companies")}>
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Editar Empresa</h2>
        <button onClick={() => navigate("/companies")}>Voltar</button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <TextInput
          name="name"
          label="Nome da Empresa"
          value={company.name}
          onChange={handleChange}
        />
        <TextInput
          name="taxId"
          label="NIF"
          value={company.taxId}
          onChange={handleChange}
        />
        <TextInput
          name="streetAdress"
          label="Morada"
          value={company.streetAdress}
          onChange={handleChange}
        />
        <TextInput
          name="postalCode"
          label="Código Postal"
          value={company.postalCode}
          onChange={handleChange}
        />
        <TextInput
          name="location"
          label="Localidade"
          value={company.location}
          onChange={handleChange}
        />
        <TextInput
          name="email"
          label="email"
          value={company.email}
          onChange={handleChange}
        />
        <TextInput
          name="phoneNumber"
          label="Telefone"
          value={company.phoneNumber}
          onChange={handleChange}
        />
        <TextInput
          name="shareCapital"
          label="Capital Social"
          value={company.shareCapital}
          onChange={handleChange}
        />

        <button
          onClick={handleSave}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Guardar Alterações
        </button>
      </div>
    </div>
  );
};
