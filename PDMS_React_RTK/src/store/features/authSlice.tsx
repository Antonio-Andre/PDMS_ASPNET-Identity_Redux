import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../../types";
//import * as MockApi from "../../apiMock/authMockApi";
import * as Api from "../../api/authApi";

interface AuthState {
  user: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

function getSavedUser(): Employee | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

const parsedUser = getSavedUser();

const initialState: AuthState = {
  user: parsedUser,
  token: parsedUser ? "mock-jwt-token-xyz-123" : null,
  isAuthenticated: !!parsedUser,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; pwd: string }) => {
    //return await MockApi.login(payload);
    return await Api.login(payload);
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = "mock-jwt-token-xyz-123";
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.jobTitle;

export default authSlice.reducer;

export const { logout } = authSlice.actions;
