import { handleResponse, handleError } from "./apiUtils";
import type { Employee } from "../types";

//VITE_DOTNET_URL=http://localhost:8080/api
const baseUrl = `${import.meta.env.VITE_DOTNET_URL}`;

export async function login({
  email,
  pwd,
}: {
  email: string;
  pwd: string;
}): Promise<Employee> {
  return fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pwd }),
  })
    .then(handleResponse)
    .then((employee: Employee) => {
      return employee;
    })
    .catch((error) => {
      handleError(error);
      throw error;
    });
}
