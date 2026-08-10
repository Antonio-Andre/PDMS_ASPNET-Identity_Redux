import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../../types";

interface AuthState {
  user: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getStoredEmail = (): string | null => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("userEmail");
  }
  return null;
};

const defaultMockUser: Employee = {
  id: 1,
  name: "Admin Dev",
  email: getStoredEmail() || "admin@dev.com",
  initials: "AD",
  department: "IT",
  jobTitle: "Admin",
  status: "Active",
  enableNotifications: true,
  passwordHash: "",
};

const initialState: AuthState = {
  user: defaultMockUser,
  token: "mock-jwt-token-xyz-123",
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: Employee; token?: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token || "mock-jwt-token-xyz-123";
      state.isAuthenticated = true;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("userEmail", action.payload.user.email);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("userEmail");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.jobTitle;

export default authSlice.reducer;
