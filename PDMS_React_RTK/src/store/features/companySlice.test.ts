import { describe, it, expect, vi } from "vitest";
import companyReducer, {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./companySlice";

import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../../types";

vi.mock("../../apiMock/companyMockApi");

describe("companySlice", () => {
  const initialCompanyState = {
    list: [],
    loading: false,
    error: null,
  };

  const mockCompany: Company = {
    id: 1,
    name: "Test Company",
    taxId: "123456789",
    businessGroupId: null,
    streetAdress: "Rua Principal 123",
    postalCode: "1000-001",
    location: "Lisboa",
    email: "test@company.com",
    phoneNumber: "912345678",
  };

  it("should return the initial state by default", () => {
    const state = companyReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialCompanyState);
  });

  describe("fetchCompanies", () => {
    it("should set loading to true when pending", () => {
      const state = companyReducer(
        initialCompanyState,
        fetchCompanies.pending(""),
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update the list and set loading to false when fulfilled", () => {
      const companiesList = [mockCompany];
      const state = companyReducer(
        initialCompanyState,
        fetchCompanies.fulfilled(companiesList, ""),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toEqual(companiesList);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Companies failed to load!";
      const state = companyReducer(
        initialCompanyState,
        fetchCompanies.rejected(new Error(errorMessage), "", undefined),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("createCompany", () => {
    it("should add new company to list when fulfilled", () => {
      const { id: _, ...payload } = mockCompany;
      const createPayload = payload as CreateCompanyPayload;

      const state = companyReducer(
        initialCompanyState,
        createCompany.fulfilled(mockCompany, "", createPayload),
      );
      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(1);
      expect(state.list[0]).toEqual(mockCompany);
    });

    it("should set error message when rejected", () => {
      const errorMessage = "Falha ao criar a empresa!";
      const { id: _, ...payload } = mockCompany;
      const createPayload = payload as CreateCompanyPayload;

      const state = companyReducer(
        initialCompanyState,
        createCompany.rejected(new Error(errorMessage), "", createPayload),
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("updateCompany", () => {
    it("should update existing company when fulfilled", () => {
      const stateWithCompany = {
        ...initialCompanyState,
        list: [mockCompany],
      };

      const updatedCompany: Company = {
        ...mockCompany,
        name: "Updated Company",
      };

      const updatePayload: UpdateCompanyPayload = {
        businessGroupId: null,
        streetAdress: "Rua Principal 123",
        postalCode: "1000-001",
        location: "Lisboa",
        email: "test@company.com",
        phoneNumber: "912345678",
      };

      const arg = { id: 1, payload: updatePayload };

      const state = companyReducer(
        stateWithCompany,
        updateCompany.fulfilled(updatedCompany, "", arg),
      );

      expect(state.loading).toBe(false);
      expect(state.list[0].name).toBe("Updated Company");
    });
  });

  describe("deleteCompany", () => {
    it("should remove company from list when fulfilled", () => {
      const stateWithCompany = {
        ...initialCompanyState,
        list: [mockCompany],
      };

      const state = companyReducer(
        stateWithCompany,
        deleteCompany.fulfilled(1, "", 1),
      );

      expect(state.loading).toBe(false);
      expect(state.list).toHaveLength(0);
    });
  });
});
