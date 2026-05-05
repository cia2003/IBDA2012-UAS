// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./hook/useContext";

import RoomForm from "./components/ui/RoomForm";
import OccupantForm from "./components/ui/OccupantForm";

import Login from "./pages/admin/Login";
import Layout from "./pages/admin/Layout";
import StaffDashboard from "./pages/admin/staff/StaffDashboard";
import RoomsDataDetails from "./pages/admin/staff/RoomsDataDetails";
import TenantList from "./pages/admin/staff/TenantList";
import NewTenantList from "./pages/admin/staff/NewTenantList";

import OwnerDashboard from "./pages/admin/manager/OwnerDashboard"
import Kost from "./pages/admin/manager/Kost";
import Staff from "./pages/admin/manager/Staff";
import StaffForm from "./pages/admin/manager/StaffForm";
import KostDetail from "./pages/admin/manager/KostDetail";

import "./style.css";
import { Toaster } from "react-hot-toast";
import KostForm from "./components/ui/KostForm";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { adminIsLoggedIn, role } = useAppContext();

  if (!adminIsLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole)
    return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  const { adminIsLoggedIn, staffData, role } = useAppContext();

  const defaultRedirect = !adminIsLoggedIn
    ? "/login"
    : role === "manager"
      ? "/dashboard/manager"
      : `/dashboard/${staffData?.id}`;

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            adminIsLoggedIn ? <Navigate to={defaultRedirect} replace /> : <Login />
          }
        />
        <Route
          path="/dashboard/:staffId"
          element={
            <ProtectedRoute allowedRole="staff">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="kamar" element={<RoomsDataDetails />} />
          <Route path="penghuni" element={<TenantList />} />
          <Route path="edit-penghuni/:occupantId" element={<OccupantForm />} />
          <Route path="tambah-kamar" element={<RoomForm />} />
          <Route path="penghuni-baru" element={<NewTenantList />} />
        </Route>

        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRole="manager">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="kost-form" element={<KostForm />} />
          <Route index element={<OwnerDashboard />} />
          <Route path="kost" element={<Kost />} />
          <Route path="edit-kost/:kostId" element={<KostForm />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff-form" element={<StaffForm />} />
          <Route path="staff-form/:staffId" element={<StaffForm />} />
          <Route path="kost-detail/:kostId" element={<KostDetail />} /> 
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
      </Routes>
    </>
  );
}
