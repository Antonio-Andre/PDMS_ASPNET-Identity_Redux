import { handleResponse, handleError } from "./apiUtils";
import type { Van } from "../types";

const baseUrl = `${import.meta.env.VITE_MOCKAPI_URL}/vans`;

export type CreateVanPayload = Omit<Van, "id">;

export interface UpdateVanPayload {
  licensePlate?: string;
  dataOfInspection?: string;
  maxLoadKg?: number;
  maxVolumeM3?: number;
  status?: Van["status"];
}

export async function getVans(): Promise<Van[]> {
  try {
    const response = await fetch(baseUrl);
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function createVan(van: CreateVanPayload): Promise<Van> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(van),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function updateVan(
  id: number,
  van: UpdateVanPayload,
): Promise<Van> {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(van),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error as Error);
    throw error;
  }
}

export async function deleteVan(id: number): Promise<void> {
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
