import { handleResponse, handleError } from "./apiUtils";
import type { Company } from "../types";

const baseUrl = "http://localhost:3069/companies"; // Definimos logo o recurso base

export async function getCompanies(): Promise<Company[]> {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export async function saveCompany(company: Company): Promise<Company> {
  // Se tem ID, estamos a editar (PUT para /companies/4)
  // Se não tem ID, estamos a criar (POST para /companies)
  const isEditing = !!company.id;
  const targetUrl = isEditing ? `${baseUrl}/${company.id}` : baseUrl;

  console.log(`A chamar a API (${isEditing ? "PUT" : "POST"}):`, targetUrl);

  return fetch(targetUrl, {
    method: isEditing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(company),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function deleteCompany(companyId: number): Promise<void> {
  // Corrigido: adicionada a barra que faltava antes do id
  return fetch(`${baseUrl}/${companyId}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}
