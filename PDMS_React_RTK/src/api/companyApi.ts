import { handleResponse, handleError } from "./apiUtils";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../types";

const baseUrl = `${import.meta.env.VITE_DOTNET_URL}/api/companies`;

export type { CreateCompanyPayload, UpdateCompanyPayload };

export async function getCompanies(): Promise<Company[]> {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export async function getCompanyById(id: number): Promise<Company> {
  return fetch(`${baseUrl}/${id}`).then(handleResponse).catch(handleError);
}

export async function createCompany(
  company: CreateCompanyPayload,
): Promise<Company> {
  return fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function updateCompany(
  id: number,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  return fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function deleteCompany(companyId: number): Promise<void> {
  return fetch(`${baseUrl}/${companyId}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}
