import { describe, it, expect, vi } from "vitest";
import shipmentReducer, {
  fetchShipments,
  approveInboundShipment,
  approveOutboundShipment,
  approveReturnShipment,
} from "./shipmentSlice";

import type { Shipment } from "../../types";

vi.mock("../../apiMock/shipmentMockApi");

describe("shipmentSlice", () => {
  const initialShipmentState = {
    list: [],
    loading: false,
    error: null,
  };

  const mockShipment: Shipment = {
    id: 1,
    registerNumber: "REG-2026-001",
    movement: "Inbound",
    items: [],
    quantity: 10,
    totalShipmentWeightKg: 50,
    status: "Registered",
    registerData: "2026-08-01",
    slaExpiration: "2026-08-10",
    dateOfDeliveryOrReturn: null,
    driverId: 1,
    vanId: 1,
    observations: "Nenhuma observação.",
  };

  it("should return the initial state by default", () => {
    const state = shipmentReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialShipmentState);
  });

  describe("fetchShipments", () => {
    it("should set loading to true when pending", () => {
      const state = shipmentReducer(
        initialShipmentState,
        fetchShipments.pending(""),
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update the list and set loading to false when fulfilled", () => {
      const shipmentsList = [mockShipment];
      const state = shipmentReducer(
        initialShipmentState,
        fetchShipments.fulfilled(shipmentsList, ""),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toEqual(shipmentsList);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Failed to load shipments";
      const state = shipmentReducer(
        initialShipmentState,
        fetchShipments.rejected(new Error(errorMessage), "", undefined),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("approveInboundShipment", () => {
    it("should update existing inbound shipment when fulfilled", () => {
      const stateWithShipment = {
        ...initialShipmentState,
        list: [mockShipment],
      };
      const updatedShipment: Shipment = {
        ...mockShipment,
        status: "Delivered",
      };

      const state = shipmentReducer(
        stateWithShipment,
        approveInboundShipment.fulfilled(updatedShipment, "", mockShipment),
      );

      expect(state.list[0].status).toBe("Delivered");
    });
  });

  describe("approveOutboundShipment", () => {
    it("should update existing outbound shipment when fulfilled", () => {
      const stateWithShipment = {
        ...initialShipmentState,
        list: [mockShipment],
      };
      const updatedShipment: Shipment = {
        ...mockShipment,
        status: "InTransit",
      };

      const state = shipmentReducer(
        stateWithShipment,
        approveOutboundShipment.fulfilled(updatedShipment, "", mockShipment),
      );

      expect(state.list[0].status).toBe("InTransit");
    });
  });

  describe("approveReturnShipment", () => {
    it("should update existing shipment if found, or append if new", () => {
      const updatedShipment: Shipment = {
        ...mockShipment,
        status: "Delivered",
      };

      // Se o envio já existe na lista, atualiza-o
      const stateWithShipment = {
        ...initialShipmentState,
        list: [mockShipment],
      };
      const stateUpdated = shipmentReducer(
        stateWithShipment,
        approveReturnShipment.fulfilled(updatedShipment, "", mockShipment),
      );
      expect(stateUpdated.list[0].status).toBe("Delivered");

      // Se não existe na lista, adiciona-o
      const stateNew = shipmentReducer(
        initialShipmentState,
        approveReturnShipment.fulfilled(updatedShipment, "", mockShipment),
      );
      expect(stateNew.list).toHaveLength(1);
      expect(stateNew.list[0]).toEqual(updatedShipment);
    });
  });
});
