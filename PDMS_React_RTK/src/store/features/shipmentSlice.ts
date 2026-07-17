import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Shipment } from "../../types";

interface ShipmentState {
  list: Shipment[];
  loading: boolean;
  error: string | null;
}

const initialState: ShipmentState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async () => {
    const response = await fetch("http://localhost:3069/shipments");
    if (!response.ok) throw new Error("Failed to load...");
    return (await response.json()) as Shipment[];
  },
);

const shipmentSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchShipments.fulfilled,
        (state, action: PayloadAction<Shipment[]>) => {
          state.loading = false;
          state.list = action.payload.map((shipment: Shipment) => ({
            ...shipment,
            totalWeightKg: (shipment.items ?? []).reduce(
              (acc: number, Item) =>
                acc + (Item.itemWeightKg ?? 0) * Item.quantity,
              0,
            ),
          }));
        },
      )
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Shipments failed to load!";
      });
  },
});

export default shipmentSlice.reducer;
