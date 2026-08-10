// stockBatchMockApi.ts
import { handleResponse, handleError } from "./apiUtils";
import type { StockBatch } from "../types";

const baseUrl = `${import.meta.env.VITE_MOCKAPI_URL}/stock`;

export async function getStockBatches(): Promise<StockBatch[]> {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export async function getStockBatchById(id: number): Promise<StockBatch> {
  return fetch(`${baseUrl}/${id}`).then(handleResponse).catch(handleError);
}

export async function saveStockBatch(batch: StockBatch): Promise<StockBatch> {
  const isEditing = !!batch.id;
  const targetUrl = isEditing ? `${baseUrl}/${batch.id}` : baseUrl;

  return fetch(targetUrl, {
    method: isEditing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(batch),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function deleteStockBatch(id: number): Promise<void> {
  return fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}
