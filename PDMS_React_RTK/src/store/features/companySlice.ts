import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Company } from "../../types";
import * as FEapi from "../../api/companyApi";

interface CompanyState {
  list: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  list: [],
  loading: false,
  error: null,
};

// companySlice.tsx
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    return await FEapi.getCompanies();
  },
);

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (company: Company) => {
    return await FEapi.saveCompany(company);
  },
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Companies failed to load!";
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.loading = false;
          // Encontra o índice da empresa que foi atualizada e substitui-a
          const index = state.list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Falha ao atualizar a empresa!";
      });
  },
});

export default companySlice.reducer;
