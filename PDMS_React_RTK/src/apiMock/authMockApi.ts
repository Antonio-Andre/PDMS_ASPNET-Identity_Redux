import { handleResponse, handleError } from "./apiUtils";
import type { Employee } from "../types";

const baseUrl = `${import.meta.env.VITE_MOCKAPI_URL}/employees`;

export async function login({
  email,
  pwd,
}: {
  email: string;
  pwd: string;
}): Promise<Employee> {
  return fetch(`${baseUrl}?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(handleResponse)
    .then((employees: Employee[]) => {
      if (!employees || employees.length === 0) {
        throw new Error("User not found");
      }

      const employee = employees[0];

      if (employee.passwordHash && employee.passwordHash !== pwd) {
        throw new Error("Incorrect password!");
      }

      return employee;
    })
    .catch((error) => {
      handleError(error);
      throw error;
    });
}
