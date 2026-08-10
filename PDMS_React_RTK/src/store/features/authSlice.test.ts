import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, {
  login,
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from "./authSlice";
import type { Employee } from "../../types";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

if (typeof window === "undefined" || !globalThis.localStorage) {
  vi.stubGlobal("localStorage", localStorageMock);
}

describe("authSlice", () => {
  const mockEmployee: Employee = {
    id: 2,
    name: "John Doe",
    email: "john.doe@dev.com",
    initials: "JD",
    department: "Logistics",
    jobTitle: "Driver",
    status: "Active",
    enableNotifications: true,
    passwordHash: "",
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return the default initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });

    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("mock-jwt-token-xyz-123");
    expect(state.user?.email).toBe("admin@dev.com");
  });

  describe("reducers", () => {
    describe("login", () => {
      it("should update user, token, set isAuthenticated to true and save email in localStorage", () => {
        const actionPayload = {
          user: mockEmployee,
          token: "custom-jwt-token-999",
        };

        const state = authReducer(
          { user: null, token: null, isAuthenticated: false },
          login(actionPayload),
        );

        expect(state.user).toEqual(mockEmployee);
        expect(state.token).toBe("custom-jwt-token-999");
        expect(state.isAuthenticated).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "userEmail",
          mockEmployee.email,
        );
      });

      it("should fallback to default token if no token is passed in payload", () => {
        const state = authReducer(
          { user: null, token: null, isAuthenticated: false },
          login({ user: mockEmployee }),
        );

        expect(state.token).toBe("mock-jwt-token-xyz-123");
      });
    });

    describe("logout", () => {
      it("should clear user, token, set isAuthenticated to false and remove email from localStorage", () => {
        const activeState = {
          user: mockEmployee,
          token: "some-token",
          isAuthenticated: true,
        };

        const state = authReducer(activeState, logout());

        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(localStorage.removeItem).toHaveBeenCalledWith("userEmail");
      });
    });
  });

  describe("selectors", () => {
    const mockRootState = {
      auth: {
        user: mockEmployee,
        token: "token-123",
        isAuthenticated: true,
      },
    };

    it("selectCurrentUser should return current user", () => {
      expect(selectCurrentUser(mockRootState)).toEqual(mockEmployee);
    });

    it("selectIsAuthenticated should return authentication state", () => {
      expect(selectIsAuthenticated(mockRootState)).toBe(true);
    });

    it("selectUserRole should return user jobTitle", () => {
      expect(selectUserRole(mockRootState)).toBe("Driver");
    });

    it("selectUserRole should return undefined if user is null", () => {
      const stateWithNoUser = {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
        },
      };

      expect(selectUserRole(stateWithNoUser)).toBeUndefined();
    });
  });
});
