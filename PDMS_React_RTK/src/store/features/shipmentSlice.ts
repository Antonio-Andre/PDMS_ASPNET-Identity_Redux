import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Shipment } from "../../types";
import * as ShipmentApi from "../../apiMock/shipmentMockApi";

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
    return await ShipmentApi.getShipments();
  },
);

export const approveInboundShipment = createAsyncThunk(
  "shipments/approveInboundShipment",
  async (shipment: Shipment) => {
    return await ShipmentApi.saveInboundShipment(shipment);
  },
);

export const approveOutboundShipment = createAsyncThunk(
  "shipments/approveOutboundShipment",
  async (shipment: Shipment) => {
    return await ShipmentApi.saveOutboundShipment(shipment);
  },
);

export const approveReturnShipment = createAsyncThunk(
  "shipments/approveReturnShipment",
  async (shipment: Shipment) => {
    return await ShipmentApi.saveReturnShipment(shipment);
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
        state.error = null;
      })
      .addCase(
        fetchShipments.fulfilled,
        (state, action: PayloadAction<Shipment[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load shipments";
      })
      .addCase(
        approveInboundShipment.fulfilled,
        (state, action: PayloadAction<Shipment>) => {
          const index = state.list.findIndex((s) => s.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addCase(
        approveOutboundShipment.fulfilled,
        (state, action: PayloadAction<Shipment>) => {
          const index = state.list.findIndex((s) => s.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addCase(
        approveReturnShipment.fulfilled,
        (state, action: PayloadAction<Shipment>) => {
          const index = state.list.findIndex((s) => s.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          } else {
            state.list.push(action.payload);
          }
        },
      );
  },
});

export default shipmentSlice.reducer;
