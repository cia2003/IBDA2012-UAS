// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./hook/useContext";
import { Toaster } from "react-hot-toast";

// UI Components
import RoomForm from "./components/ui/RoomForm";
import OccupantForm from "./components/ui/OccupantForm";
import KostForm from "./components/ui/KostForm";

// Admin Pages
import Login from "./pages/admin/Login";
import Layout from "./pages/admin/Layout";

// Staff Pages
import StaffDashboard from "./pages/admin/staff/StaffDashboard";
import RoomsDataDetails from "./pages/admin/staff/RoomsDataDetails";
import TenantList from "./pages/admin/staff/TenantList";
import NewTenantList from "./pages/admin/staff/NewTenantList";

// Manager Pages
import OwnerDashboard from "./pages/admin/manager/OwnerDashboard";
import Kost from "./pages/admin/manager/Kost";
import Staff from "./pages/admin/manager/Staff";
import StaffForm from "./pages/admin/manager/StaffForm";
import KostDetail from "./pages/admin/manager/KostDetail";

// User Pages
import Home from "./pages/user/Home/Home";
import User from "./pages/user/User";
import WishList from "./pages/user/WishList";
import UserLogin from "./pages/user/UserLogin";
import UserKostDetail from "./pages/user/UserKostDetail/UserKostDetail";

// Other
import NotFoundPage from "./pages/NotFoundPage";
import "./style.css";

const AdminProtectedRoute = ({ children, allowedRole }) => {
  const { adminIsLoggedIn, role } = useAppContext();

  if (!adminIsLoggedIn) return <Navigate to="/admin/login" replace />;
  if (allowedRole && role !== allowedRole)
    return <Navigate to="/admin/login" replace />;

  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { userIsLoggedIn } = useAppContext();

  if (!userIsLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  const { adminIsLoggedIn, role, staffData } = useAppContext();

  const adminDefaultRedirect = !adminIsLoggedIn
    ? "/admin/login"
    : role === "manager"
      ? "/admin/dashboard/manager"
      : `/admin/dashboard/${staffData?.id}`;

  return (
    <>
      <Toaster />
      <Routes>
        {/* ── User Routes ── */}
        <Route path="/" element={<User />}>
          <Route index element={<Home />} />
          <Route path="kost" element={<h1>Semua Kost</h1>} />
          <Route path="kost/:kostId" element={<UserKostDetail />} />
          <Route path="login" element={<UserLogin />} />
          <Route
            path="favorite"
            element={
              <UserProtectedRoute>
                <WishList />
              </UserProtectedRoute>
            }
          />
        </Route>

        {/* ── Staff Routes ── */}
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
          <Route path="penghuni-baru" element={<NewTenantList />} />
          <Route path="edit-penghuni/:occupantId" element={<OccupantForm />} />
          <Route path="tambah-kamar" element={<RoomForm />} />
        </Route>

        {/* ── Manager Routes ── */}
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
          <Route path="kost-detail/:kostId" element={<KostDetail />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff-form" element={<StaffForm />} />
          <Route path="staff-form/:staffId" element={<StaffForm />} />
        </Route>

        {/* ── Auth & Fallback ── */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
