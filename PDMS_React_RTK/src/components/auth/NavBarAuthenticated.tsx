import React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/useUser";

export const NavbarAuthenticated = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (!user) {
    return (
      <nav style={styles.navContainer}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          <span style={{ color: "white" }}>🚐 PDMS</span>
        </div>

        <div style={{ fontSize: "0.9rem", color: "#bdc3c7" }}>Não Logado</div>
      </nav>
    );
  }
  return (
    <nav style={styles.navContainer}>
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        <NavLink to="/home" style={{ color: "white", textDecoration: "none" }}>
          🚐 PDMS
        </NavLink>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        {["companies", "vans", "shipments", "employees"].map((path) => (
          <NavLink
            key={path}
            to={`/${path}`}
            style={({ isActive }) => ({
              ...styles.navLinkStyle,
              fontWeight: isActive ? "bold" : "normal",
              borderBottom: isActive ? "2px solid white" : "none",
            })}
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </NavLink>
        ))}
      </div>
      <div
        onClick={() => setShowLogout(!showLogout)}
        style={{ cursor: "pointer", position: "relative", textAlign: "right" }}
      >
        <div style={{ fontSize: "0.9rem" }}>
          {user?.name} <br />
          <span style={{ fontSize: "0.7rem", color: "#bdc3c7" }}>
            {user?.jobTitle}
          </span>
        </div>
        {showLogout && (
          <div style={styles.dropdown}>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#2c3e50",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "white",
    zIndex: 1000,
  } as React.CSSProperties,

  navLinkStyle: {
    color: "white",
    textDecoration: "none",
    marginRight: "20px",
  } as React.CSSProperties,

  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "white",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    color: "black",
  } as React.CSSProperties,

  logoutButton: {
    cursor: "pointer",
    backgroundColor: "#2C3E50",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
  } as React.CSSProperties,
};
