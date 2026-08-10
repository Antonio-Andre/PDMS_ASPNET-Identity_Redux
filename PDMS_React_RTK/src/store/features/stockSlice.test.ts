import { describe, it, expect, vi } from "vitest";
import stockReducer, {
  fetchAllStock,
  fetchStockById,
  setSelectedId,
  clearSelectedId,
} from "./stockSlice";

import type { StockBatch } from "../../types";

vi.mock("../../apiMock/stockMockApi");

describe("stockSlice", () => {
  const initialState = {
    list: [],
    selectedId: null,
    loading: false,
    error: null,
  };

  const mockBatch: StockBatch = {
    id: 101,
    batchNumber: "BATCH-2026-001",
    product: "ChickenMeat_Box_5kg",
    originalQuantity: 50,
    currentQuantity: 50,
    unit: "Box",
    source: "Fornecedor Central",
    entryDate: "2026-08-01",
    expiryDate: "2026-12-31",
  };

  it("should return initial state by default", () => {
    const state = stockReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  describe("reducers", () => {
    it("should set selectedId", () => {
      const state = stockReducer(initialState, setSelectedId(101));
      expect(state.selectedId).toBe(101);
    });

    it("should clear selectedId", () => {
      const stateWithId = { ...initialState, selectedId: 101 };
      const state = stockReducer(stateWithId, clearSelectedId());
      expect(state.selectedId).toBeNull();
    });
  });

  describe("fetchAllStock", () => {
    it("should set loading to true when pending", () => {
      const state = stockReducer(initialState, fetchAllStock.pending(""));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update list and set loading false when fulfilled", () => {
      const state = stockReducer(
        initialState,
        fetchAllStock.fulfilled([mockBatch], ""),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toEqual([mockBatch]);
    });

    it("should set error when rejected", () => {
      const errorMessage = "Server Error";
      const state = stockReducer(
        initialState,
        fetchAllStock.rejected(
          new Error(errorMessage),
          "",
          undefined,
          errorMessage,
        ),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("fetchStockById", () => {
    it("should set loading to true when pending", () => {
      const state = stockReducer(initialState, fetchStockById.pending("", 101));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update selectedId and replace item in list if exists", () => {
      const stateWithItem = { ...initialState, list: [mockBatch] };
      const updatedBatch: StockBatch = { ...mockBatch, currentQuantity: 100 };

      const state = stockReducer(
        stateWithItem,
        fetchStockById.fulfilled(updatedBatch, "", 101),
      );

      expect(state.loading).toBe(false);
      expect(state.selectedId).toBe(101);
      expect(state.list[0].currentQuantity).toBe(100);
    });

    it("should push item to list if it does not exist yet", () => {
      const state = stockReducer(
        initialState,
        fetchStockById.fulfilled(mockBatch, "", 101),
      );

      expect(state.loading).toBe(false);
      expect(state.selectedId).toBe(101);
      expect(state.list).toHaveLength(1);
      expect(state.list[0]).toEqual(mockBatch);
    });

    it("should set error when rejected", () => {
      const errorMessage = "Batch not found";
      const state = stockReducer(
        initialState,
        fetchStockById.rejected(new Error(errorMessage), "", 101, errorMessage),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
