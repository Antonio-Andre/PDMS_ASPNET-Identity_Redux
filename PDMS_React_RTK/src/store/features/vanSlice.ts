import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Van } from "../../types";
import {
  getVans,
  createVan as apiCreateVan,
  updateVan as apiUpdateVan,
  deleteVan as apiDeleteVan,
  type CreateVanPayload,
  type UpdateVanPayload,
} from "../../apiMock/vanMockApi";

interface VanState {
  list: Van[];
  loading: boolean;
  error: string | null;
}

const initialState: VanState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchVans = createAsyncThunk("vans/fetchVans", async () => {
  return await getVans();
});

export const createVan = createAsyncThunk(
  "vans/createVan",
  async (payload: CreateVanPayload) => {
    return await apiCreateVan(payload);
  },
);

export const updateVan = createAsyncThunk(
  "vans/updateVan",
  async ({ id, payload }: { id: number; payload: UpdateVanPayload }) => {
    return await apiUpdateVan(id, payload);
  },
);

export const deleteVan = createAsyncThunk(
  "vans/deleteVan",
  async (id: number) => {
    await apiDeleteVan(id);
    return id; // Retorna o ID para o reducer remover da lista
  },
);

const vanSlice = createSlice({
  name: "vans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVans.fulfilled, (state, action: PayloadAction<Van[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Vans failed to load!";
      })
      .addCase(createVan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVan.fulfilled, (state, action: PayloadAction<Van>) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createVan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create van!";
      })
      .addCase(updateVan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVan.fulfilled, (state, action: PayloadAction<Van>) => {
        state.loading = false;
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateVan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update van!";
      })
      .addCase(deleteVan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVan.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.list = state.list.filter((v) => v.id !== action.payload);
      })
      .addCase(deleteVan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete van!";
      });
  },
});

export default vanSlice.reducer;
