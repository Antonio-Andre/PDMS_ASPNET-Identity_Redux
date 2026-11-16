import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { login } from "../store/features/authSlice";
import { TextInput } from "../components/TextInput";
import { Navbar } from "../components/Navbar";

export const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const resultAction = await dispatch(login({ email: email, pwd: password }));

    if (login.fulfilled.match(resultAction)) {
      navigate("/home");
    } else {
      setError((resultAction.payload as string) || "Credenciais inválidas");
    }
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
            type="text"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? "Dados inválidos" : undefined}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
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
    backgroundColor: "#fff",
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
