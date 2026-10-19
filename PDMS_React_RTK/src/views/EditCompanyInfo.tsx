import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { createCompany, updateCompany } from "../store/features/companySlice";
import { useParams, useNavigate } from "react-router-dom";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../types";
import { TextInput } from "../components/TextInput";

interface EditCompanyProps {
  companies: Company[];
  isLoading?: boolean;
}

type CompanyFormState = {
  name: string;
  taxId: string;
  businessGroupId: string;
  streetAdress: string;
  postalCode: string;
  location: string;
  email: string;
  phoneNumber: string;
};

const emptyForm: CompanyFormState = {
  name: "",
  taxId: "",
  businessGroupId: "",
  streetAdress: "",
  postalCode: "",
  location: "",
  email: "",
  phoneNumber: "",
};

function toFormState(company?: Company): CompanyFormState {
  if (!company) return emptyForm;
  return {
    name: company.name,
    taxId: company.taxId,
    businessGroupId:
      company.businessGroupId === null || company.businessGroupId === undefined
        ? ""
        : String(company.businessGroupId),
    streetAdress: company.streetAdress,
    postalCode: company.postalCode,
    location: company.location,
    email: company.email,
    phoneNumber: company.phoneNumber,
  };
}

function parseBusinessGroupId(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export const EditCompanyInfo = ({
  companies,
  isLoading = false,
}: EditCompanyProps) => {
  const { id } = useParams<{ id: string }>();
  const isCreate = !id;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const originalCompany = isCreate
    ? undefined
    : companies.find((c) => String(c.id) === id);

  const [form, setForm] = useState<CompanyFormState>(() =>
    toFormState(originalCompany),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (originalCompany) {
      setForm(toFormState(originalCompany));
    }
  }, [originalCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const businessGroupId = parseBusinessGroupId(form.businessGroupId);

    try {
      setSaving(true);
      if (isCreate) {
        const payload: CreateCompanyPayload = {
          name: form.name,
          taxId: form.taxId,
          businessGroupId,
          streetAdress: form.streetAdress,
          postalCode: form.postalCode,
          location: form.location,
          email: form.email,
          phoneNumber: form.phoneNumber,
        };
        await dispatch(createCompany(payload)).unwrap();
        alert("Empresa criada com sucesso!");
      } else if (originalCompany) {
        const payload: UpdateCompanyPayload = {
          businessGroupId,
          streetAdress: form.streetAdress,
          postalCode: form.postalCode,
          location: form.location,
          email: form.email,
          phoneNumber: form.phoneNumber,
        };
        await dispatch(
          updateCompany({ id: originalCompany.id, payload }),
        ).unwrap();
        alert("Guardado com sucesso!");
      }
      navigate("/companies");
    } catch (err) {
      console.error("Erro ao guardar empresa:", err);
      alert("Falha ao guardar: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (!isCreate && isLoading && !originalCompany) {
    return <h2>A carregar empresas do PDMS...</h2>;
  }

  if (!isCreate && !originalCompany) {
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
        <h2>{isCreate ? "Nova Empresa" : "Editar Empresa"}</h2>
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
          value={form.name}
          onChange={handleChange}
          disabled={!isCreate}
        />
        <TextInput
          name="taxId"
          label="NIF"
          value={form.taxId}
          onChange={handleChange}
          disabled={!isCreate}
        />
        <TextInput
          name="businessGroupId"
          label="ID do Grupo Empresarial"
          value={form.businessGroupId}
          onChange={handleChange}
          type="number"
        />
        <TextInput
          name="streetAdress"
          label="Morada"
          value={form.streetAdress}
          onChange={handleChange}
        />
        <TextInput
          name="postalCode"
          label="Código Postal"
          value={form.postalCode}
          onChange={handleChange}
        />
        <TextInput
          name="location"
          label="Localidade"
          value={form.location}
          onChange={handleChange}
        />
        <TextInput
          name="email"
          label="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />
        <TextInput
          name="phoneNumber"
          label="Telefone"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {saving
            ? "A guardar..."
            : isCreate
              ? "Criar Empresa"
              : "Guardar Alterações"}
        </button>
      </div>
    </div>
  );
};
