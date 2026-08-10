import { describe, it, expect, vi } from "vitest";
import employeeReducer, {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employeeSlice";

import type { Employee } from "../../types";
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../../apiMock/employeeMockApi";

vi.mock("../../apiMock/employeeMockApi");

describe("employeeSlice", () => {
  const initialEmployeeState = {
    list: [],
    loading: false,
    error: null,
  };

  const mockEmployee: Employee = {
    id: 1,
    name: "Test Employee",
    email: "test@employee.com",
    initials: "TE",
    department: "Distribution",
    jobTitle: "DeliveryDriver",
    status: "Active",
    enableNotifications: true,
    passwordHash: "hashed_password",
  };

  it("should return the initial state by default", () => {
    const state = employeeReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialEmployeeState);
  });

  describe("fetchEmployees", () => {
    it("should set loading to true when pending", () => {
      const state = employeeReducer(
        initialEmployeeState,
        fetchEmployees.pending(""),
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update the list and set loading to false when fulfilled", () => {
      const employeesList = [mockEmployee];
      const state = employeeReducer(
        initialEmployeeState,
        fetchEmployees.fulfilled(employeesList, ""),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toEqual(employeesList);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Employees failed to load!";
      const state = employeeReducer(
        initialEmployeeState,
        fetchEmployees.rejected(new Error(errorMessage), "", undefined),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("createEmployee", () => {
    it("should add new employee to list when fulfilled", () => {
      const { id: _, ...payload } = mockEmployee;
      const createPayload = payload as CreateEmployeePayload;

      const state = employeeReducer(
        initialEmployeeState,
        createEmployee.fulfilled(mockEmployee, "", createPayload),
      );

      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(1);
      expect(state.list[0]).toEqual(mockEmployee);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Falha ao criar o funcionário!";
      const { id: _, ...payload } = mockEmployee;
      const createPayload = payload as CreateEmployeePayload;

      const state = employeeReducer(
        initialEmployeeState,
        createEmployee.rejected(new Error(errorMessage), "", createPayload),
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("updateEmployee", () => {
    it("should update existing employee when fulfilled", () => {
      const stateWithEmployee = {
        ...initialEmployeeState,
        list: [mockEmployee],
      };

      const updatedEmployee: Employee = {
        ...mockEmployee,
        name: "Updated Employee",
      };

      const { id: _, ...payload } = updatedEmployee;
      const updatePayload = payload as UpdateEmployeePayload;

      const arg = { id: 1, payload: updatePayload };

      const state = employeeReducer(
        stateWithEmployee,
        updateEmployee.fulfilled(updatedEmployee, "", arg),
      );

      expect(state.loading).toBe(false);
      expect(state.list[0].name).toBe("Updated Employee");
    });
  });

  describe("deleteEmployee", () => {
    it("should remove employee from list when fulfilled", () => {
      const stateWithEmployee = {
        ...initialEmployeeState,
        list: [mockEmployee],
      };

      const state = employeeReducer(
        stateWithEmployee,
        deleteEmployee.fulfilled(1, "", 1),
      );

      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(0);
    });
  });
});
