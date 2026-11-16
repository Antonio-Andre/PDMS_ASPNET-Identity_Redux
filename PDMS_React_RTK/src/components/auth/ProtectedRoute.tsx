import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/features/authSlice";
import { NavbarAuthenticated } from "./NavBarAuthenticated";

export const ProtectedRoute = () => {
  const hasToken = useSelector(selectIsAuthenticated);

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
