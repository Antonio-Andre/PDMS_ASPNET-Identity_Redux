import { createContext } from "react";
import type { Employee } from "../types.ts";

export interface UserContextType {
  user: Employee | null;
  login: (userData: Employee) => void;
  logout: () => void;
}

// É só isto! Cria o canal vazio (molde) para os outros usarem.
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
