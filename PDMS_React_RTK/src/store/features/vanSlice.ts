import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Van } from "../../types";

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
  const response = await fetch("http://localhost:3069/vans");
  if (!response.ok) throw new Error("Falha ao carregar");
  return (await response.json()) as Van[];
});

const vanSlice = createSlice({
  name: "vans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVans.fulfilled, (state, action: PayloadAction<Van[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Vans failed to load!";
      });
  },
});

export default vanSlice.reducer;
