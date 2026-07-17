import { useState } from "react";
import type { Employee } from "../types";
import { UserContext } from "./UserContext"; // Importa o molde lá de cima

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Aqui sim, a lógica vive de forma legítima dentro do componente!
  const [user, setUser] = useState<Employee | null>(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      return {
        id: 0, // Id temporário enquanto faz o refresh
        name: "",
        email: savedEmail,
        initials: "",
        department: "",
        jobTitle: "Admin", // Valor padrão para jobTitle
        status: "Active",
        enableNotifications: true,
        passwordHash: "",
      };
    }
    return null;
  });

  const login = (userData: Employee) => {
    localStorage.setItem("userEmail", userData.email);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    // Injeta os dados reais e as funções dentro do molde do Context
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
