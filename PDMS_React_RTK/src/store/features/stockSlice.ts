import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StockBatch } from "../../types";
import * as MockApi from "../../apiMock/stockMockApi";

interface BatchesState {
  list: StockBatch[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  list: [],
  selectedId: null,
  loading: false,
  error: null,
};

export const fetchAllStock = createAsyncThunk(
  "stock/fetchAllStock",
  async (_, { rejectWithValue }) => {
    try {
      const data = await MockApi.getStockBatches();
      return data as StockBatch[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchStockById = createAsyncThunk(
  "stock/fetchStockById",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await MockApi.getStockBatchById(id);
      return data as StockBatch;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    clearSelectedId: (state) => {
      state.selectedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //batch
      .addCase(fetchAllStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllStock.fulfilled,
        (state, action: PayloadAction<StockBatch[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchAllStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Indvidual stock item fetch
      .addCase(fetchStockById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStockById.fulfilled,
        (state, action: PayloadAction<StockBatch>) => {
          state.loading = false;
          state.selectedId = action.payload.id;
          const index = state.list.findIndex(
            (sb) => sb.id === action.payload.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload;
          } else {
            state.list.push(action.payload);
          }
        },
      )
      .addCase(fetchStockById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedId, clearSelectedId } = stockSlice.actions;
export default stockSlice.reducer;
