import React from "react";

export const Navbar = () => (
  <nav style={styles.navContainer}>
    <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>🚐 PDMS</div>
    <div style={{ fontSize: "0.9rem", color: "#bdc3c7" }}>Não Logado</div>
  </nav>
);

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
};
