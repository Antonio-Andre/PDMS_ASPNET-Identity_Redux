import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../../types";
import * as Api from "../../api/companyApi";
//import * as MockApi from "../../apiMock/companyMockApi";

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

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    return await Api.getCompanies();
  },
);

export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (payload: CreateCompanyPayload) => {
    return await Api.createCompany(payload);
  },
);

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, payload }: { id: number; payload: UpdateCompanyPayload }) => {
    return await Api.updateCompany(id, payload);
  },
);

export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id: number) => {
    await Api.deleteCompany(id);
    return id;
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
        state.error = null;
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
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.loading = false;
          state.list.push(action.payload);
        },
      )
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Companies failed to load!";
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.loading = false;
          const index = state.list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Companies failed to update!";
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter((c) => c.id !== action.payload);
        },
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Company failed to delete!";
      });
  },
});

export default companySlice.reducer;
