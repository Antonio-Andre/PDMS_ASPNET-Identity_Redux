import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { NavbarAuthenticated } from "./NavBarAuthenticated";

export const ProtectedRoute = () => {
  const hasToken = !!localStorage.getItem("userEmail");

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const ProtectedLayout = () => {
  return (
    <div style={{ marginTop: "80px" }}>
      <NavbarAuthenticated />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};
