import { handleResponse, handleError } from "./apiUtils";
import type { Shipment, StockBatch } from "../types";
import * as StockApi from "./stockMockApi";

const baseUrl = `${import.meta.env.VITE_MOCKAPI_URL}/shipments`;

export async function getShipments(): Promise<Shipment[]> {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export async function getShipmentById(id: number): Promise<Shipment> {
  return fetch(`${baseUrl}/${id}`).then(handleResponse).catch(handleError);
}

//1.1
export async function saveInboundShipment(
  shipment: Shipment,
): Promise<Shipment> {
  const isEditing = !!shipment.id;
  const targetUrl = isEditing ? `${baseUrl}/${shipment.id}` : baseUrl;

  const savedShipment: Shipment = await fetch(targetUrl, {
    method: isEditing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(shipment),
  })
    .then(handleResponse)
    .catch(handleError);

  for (const item of savedShipment.items) {
    const newBatch: StockBatch = {
      id: 0,
      batchNumber: item.batchNumber,
      product: item.product,
      originalQuantity: item.quantity,
      currentQuantity: item.quantity,
      unit: "Box",
      source: `Inbound Shipment #${savedShipment.registerNumber}`,
      entryDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    };

    await StockApi.saveStockBatch(newBatch);
  }

  return savedShipment;
}

export async function saveOutboundShipment(
  shipment: Shipment,
): Promise<Shipment> {
  const existingBatches = await StockApi.getStockBatches();

  for (const item of shipment.items) {
    const targetBatch = existingBatches.find(
      (b: StockBatch) => b.batchNumber === item.batchNumber,
    );

    if (targetBatch) {
      const updatedBatch: StockBatch = {
        ...targetBatch,
        currentQuantity: Math.max(
          0,
          targetBatch.currentQuantity - item.quantity,
        ),
      };

      await StockApi.saveStockBatch(updatedBatch);
    }
  }

  const isEditing = !!shipment.id;
  const targetUrl = isEditing ? `${baseUrl}/${shipment.id}` : baseUrl;

  return fetch(targetUrl, {
    method: isEditing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(shipment),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function saveReturnShipment(
  shipment: Shipment,
): Promise<Shipment> {
  const existingBatches = await StockApi.getStockBatches();

  for (const item of shipment.items) {
    const targetBatch = existingBatches.find(
      (b: StockBatch) => b.batchNumber === item.batchNumber,
    );

    if (targetBatch) {
      const updatedBatch: StockBatch = {
        ...targetBatch,
        currentQuantity: targetBatch.currentQuantity + item.quantity, // Devolução soma ao stock
      };

      await StockApi.saveStockBatch(updatedBatch);
    }
  }

  const isEditing = !!shipment.id;
  const targetUrl = isEditing ? `${baseUrl}/${shipment.id}` : baseUrl;

  return fetch(targetUrl, {
    method: isEditing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(shipment),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function deleteShipment(id: number): Promise<void> {
  return fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}
