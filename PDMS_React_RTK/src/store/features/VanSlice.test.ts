import { describe, it, expect, vi } from "vitest";
import vanReducer, {
  fetchVans,
  createVan,
  updateVan,
  deleteVan,
} from "./vanSlice";

import type { Van } from "../../types";
import type {
  CreateVanPayload,
  UpdateVanPayload,
} from "../../apiMock/vanMockApi";

vi.mock("../../apiMock/vanMockApi");

describe("vanSlice", () => {
  const initialVanState = {
    list: [],
    loading: false,
    error: null,
  };

  const mockVan: Van = {
    id: 1,
    licensePlate: "AA-00-AA",
    dataOfInspection: "2026-10-10",
    maxLoadKg: 1200,
    maxVolumeM3: 15,
    status: "Available",
  };

  it("should return the initial state by default", () => {
    const state = vanReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialVanState);
  });

  describe("fetchVans", () => {
    it("should set loading to true when pending", () => {
      const state = vanReducer(initialVanState, fetchVans.pending(""));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update the list and set loading to false when fulfilled", () => {
      const vansList = [mockVan];
      const state = vanReducer(
        initialVanState,
        fetchVans.fulfilled(vansList, ""),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toEqual(vansList);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Vans failed to load!";
      const state = vanReducer(
        initialVanState,
        fetchVans.rejected(new Error(errorMessage), "", undefined),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("createVan", () => {
    it("should add new van to list when fulfilled", () => {
      const { id: _, ...payload } = mockVan;
      const createPayload = payload as CreateVanPayload;

      const state = vanReducer(
        initialVanState,
        createVan.fulfilled(mockVan, "", createPayload),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(1);
      expect(state.list[0]).toEqual(mockVan);
    });
  });

  describe("updateVan", () => {
    it("should update existing van when fulfilled", () => {
      const stateWithVan = {
        ...initialVanState,
        list: [mockVan],
      };

      const updatedVan: Van = {
        ...mockVan,
        status: "Transporting",
      };

      const updatePayload: UpdateVanPayload = { status: "Transporting" };
      const arg = { id: 1, payload: updatePayload };

      const state = vanReducer(
        stateWithVan,
        updateVan.fulfilled(updatedVan, "", arg),
      );

      expect(state.loading).toBe(false);
      expect(state.list[0].status).toBe("Transporting");
    });
  });

  describe("deleteVan", () => {
    it("should remove van from list when fulfilled", () => {
      const stateWithVan = {
        ...initialVanState,
        list: [mockVan],
      };

      const state = vanReducer(stateWithVan, deleteVan.fulfilled(1, "", 1));

      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(0);
    });
  });
});
