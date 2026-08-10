import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Substituímos o useUser pelo useDispatch do Redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { login } from "../store/features/authSlice";
import { TextInput } from "../components/TextInput";
import { Navbar } from "../components/Navbar";

export const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const employees = useSelector((state: RootState) => state.employees.list);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    setTimeout(() => {
      const user = employees.find((emp) => emp.email === email);

      if (user && user.passwordHash === password) {
        dispatch(login({ user }));

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
