import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { TextInput } from "../components/TextInput";
import { useUser } from "../context/useUser";
import { Navbar } from "../components/Navbar";

export const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const employees = useSelector((state: RootState) => state.employees.list);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e: React.SubmitEvent) => {
    e.preventDefault();

    setError("");

    setTimeout(() => {
      const user = employees.find((emp) => emp.email === email);

      if (user && user.passwordHash === password) {
        //validar data através do BackEnd num furturo!!!!
        login(user);
        localStorage.setItem("userEmail", email);
        navigate("/home");
      } else {
        setError("Email ou password incorretos.");
      }
    }, 50);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <form onSubmit={handleLogin} style={styles.form}>
          <h2>Login</h2>
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? "Dados inválidos" : undefined}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

// CSS inline simples para não perderes tempo com ficheiros de estilo agora
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
