import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import type { Employee } from "../../types";
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
  token: null,
  isAuthenticated: !!parsedUser,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; pwd: string }) => {
    await Api.login(payload);
    return await Api.getCurrentUser();
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    return await Api.getCurrentUser();
  },
);

const applyAuthenticatedUser: CaseReducer<
  AuthState,
  PayloadAction<Employee>
> = (state, action) => {
  state.loading = false;
  state.error = null;
  state.isAuthenticated = true;
  state.user = action.payload;
  state.token = null;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("user", JSON.stringify(action.payload));
  }
};

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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, applyAuthenticatedUser)
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Falha ao iniciar sessão";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, applyAuthenticatedUser)
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("user");
        }
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
