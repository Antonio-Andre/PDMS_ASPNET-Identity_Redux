import { handleResponse, handleError } from "./apiUtils";
import type { Employee } from "../types";

const baseUrl = `${import.meta.env.VITE_MOCKAPI_URL}/employees`;

export type CreateEmployeePayload = Omit<Employee, "id">;

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  initials?: string;
  department?: string;
  jobTitle?: Employee["jobTitle"];
  status?: Employee["status"];
  enableNotifications?: boolean;
  passwordHash?: string;
}

export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(baseUrl);
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function createEmployee(
  employee: CreateEmployeePayload,
): Promise<Employee> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(employee),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function updateEmployee(
  id: number,
  employee: UpdateEmployeePayload,
): Promise<Employee> {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(employee),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
    });
    await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}
