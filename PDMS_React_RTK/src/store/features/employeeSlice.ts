import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../../types";
import * as MockApi from "../../apiMock/employeeMockApi";
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../../apiMock/employeeMockApi";

interface EmployeeState {
  list: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    return await MockApi.getEmployees();
  },
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (payload: CreateEmployeePayload) => {
    return await MockApi.createEmployee(payload);
  },
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) => {
    return await MockApi.updateEmployee(id, payload);
  },
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id: number) => {
    await MockApi.deleteEmployee(id);
    return id;
  },
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Employees failed to load!";
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.loading = false;
          state.list.push(action.payload);
        },
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Falha ao criar o funcionário!";
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.loading = false;
          const index = state.list.findIndex((e) => e.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Falha ao atualizar o funcionário!";
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter((e) => e.id !== action.payload);
        },
      )
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Falha ao deletar o funcionário!";
      });
  },
});

export default employeeSlice.reducer;
