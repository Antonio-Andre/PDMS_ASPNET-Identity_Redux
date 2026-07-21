import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import {
  ProtectedRoute,
  ProtectedLayout,
} from "./components/auth/ProtectedRoute.tsx";
import { fetchEmployees } from "./store/features/employeeSlice";
import { fetchVans } from "./store/features/vanSlice";
import { fetchCompanies } from "./store/features/companySlice";
import { fetchShipments } from "./store/features/shipmentSlice";
import { Navbar } from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./views/HomePage.tsx";
import { CompaniesView } from "./views/Companies.tsx";
import { VansView } from "./views/Vans";
import { EmployeesView } from "./views/Employees.tsx";
import { ShipmentsView } from "./views/Shipments.tsx";
import { SingleShipmentItemList } from "./views/SingleShipmentItemList.tsx";
import { EditCompanyInfo } from "./views/EditCompanyInfo.tsx";
import { LoginView } from "./views/LoginView.tsx";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: employeeList,
    loading: employeeLoading,
    error: employeeError,
  } = useSelector((state: RootState) => state.employees);

  const {
    list: vansList,
    loading: vansLoading,
    error: vansError,
  } = useSelector((state: RootState) => state.vans);

  const {
    list: companyList,
    loading: companyLoading,
    error: companyError,
  } = useSelector((state: RootState) => state.companies);

  const {
    list: shipmentList,
    loading: shipmentLoading,
    error: shipmentError,
  } = useSelector((state: RootState) => state.shipments);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchVans());
    dispatch(fetchCompanies());
    dispatch(fetchShipments());
  }, [dispatch]);

  if (employeeError)
    return <h2 style={{ color: "red" }}>Erro: {employeeError}</h2>;
  if (vansError) return <h2 style={{ color: "red" }}>Erro: {vansError}</h2>;
  if (companyError)
    return <h2 style={{ color: "red" }}>Erro: {companyError}</h2>;
  if (shipmentError)
    return <h2 style={{ color: "red" }}>Erro: {shipmentError}</h2>;

  return (
    <div style={{ marginTop: "80px" }}>
      {" "}
      {}
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/company/edit/:id"
                element={<EditCompanyInfo companies={companyList} />}
              />
              <Route
                path="/companies"
                element={
                  <CompaniesView
                    companies={companyList}
                    isLoading={companyLoading}
                  />
                }
              />
              <Route
                path="/vans"
                element={
                  <VansView
                    vans={vansList}
                    isLoading={vansLoading}
                    onAssign={(/*regNumber, vanId*/) => {}}
                  />
                }
              />
              <Route
                path="/employees"
                element={
                  <EmployeesView
                    employees={employeeList}
                    isLoading={employeeLoading}
                  />
                }
              />
              <Route
                path="/shipment/:id"
                element={<SingleShipmentItemList shipments={shipmentList} />}
              />
              <Route
                path="/shipments"
                element={
                  <ShipmentsView
                    shipments={shipmentList}
                    isLoading={shipmentLoading}
                  />
                }
              />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
