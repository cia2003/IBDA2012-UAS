import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./hook/useContext";
import { Toaster } from "react-hot-toast";

import Login from "./pages/admin/Login";
import Layout from "./pages/admin/Layout";
import StaffDashboard from "./pages/admin/staff/StaffDashboard";
import RoomsDataDetails from "./pages/admin/staff/RoomsDataDetails";
import TenantList from "./pages/admin/staff/TenantList";
import NewTenantList from "./pages/admin/staff/NewTenantList";
import OwnerDashboard from "./pages/admin/manager/OwnerDashboard";
import Kost from "./pages/admin/manager/Kost";
import Staff from "./pages/admin/manager/Staff";
import StaffForm from "./pages/admin/manager/StaffForm";
import KostDetail from "./pages/admin/manager/KostDetail";
import KostForm from "./components/ui/KostForm";
import RoomForm from "./components/ui/RoomForm";
import OccupantForm from "./components/ui/OccupantForm";

import Home from './pages/user/Home';
import User from "./pages/user/User";
import WishList from "./pages/user/WishList";
import UserLogin from "./pages/user/UserLogin";
import NotFoundPage from "./pages/NotFoundPage";

import "./style.css";
import RegistrationForm from "./pages/user/RegistrationForm";

const AdminProtectedRoute = ({ children, allowedRole }) => {
  const { adminIsLoggedIn, role, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!adminIsLoggedIn) return <Navigate to="/admin/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/admin/login" replace />;

  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { userIsLoggedIn, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!userIsLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  const { adminIsLoggedIn, userIsLoggedIn, staffData, role } = useAppContext();

  return (
    <>
      <Toaster />
      <Routes>
        {/* --- PUBLIC & USER ROUTES --- */}
        <Route path="/" element={<User />}>
          <Route index element={<Home />} />
          <Route path="detail-kost/:kostId" element={<div>Detail Kost Page</div>} />
          <Route path="login" element={userIsLoggedIn ? <Navigate to="/" /> : <UserLogin />} />
          
          {/* Wishlist dan Form registrasi hanya bisa diakses jika login user */}
          <Route path="favorite" element={
            <UserProtectedRoute>
              <WishList />
              <RegistrationForm />
            </UserProtectedRoute>
          } />
        </Route>

        <Route path="/admin/login" element={adminIsLoggedIn ? <Navigate to="/admin/dashboard/manager" /> : <Login />} />

        {/* --- STAFF ROUTES --- */}
        <Route
          path="/admin/dashboard/:staffId"
          element={
            <AdminProtectedRoute allowedRole="staff">
              <Layout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="kamar" element={<RoomsDataDetails />} />
          <Route path="penghuni" element={<TenantList />} />
          <Route path="edit-penghuni/:occupantId" element={<OccupantForm />} />
          <Route path="tambah-kamar" element={<RoomForm />} />
          <Route path="penghuni-baru" element={<NewTenantList />} />
        </Route>

        {/* --- MANAGER ROUTES --- */}
        <Route
          path="/admin/dashboard/manager"
          element={
            <AdminProtectedRoute allowedRole="manager">
              <Layout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="kost" element={<Kost />} />
          <Route path="kost-form" element={<KostForm />} />
          <Route path="edit-kost/:kostId" element={<KostForm />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff-form" element={<StaffForm />} />
          <Route path="staff-form/:staffId" element={<StaffForm />} />
          <Route path="kost-detail/:kostId" element={<KostDetail />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}