import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./hook/useAppContext";
import Login from "./pages/Login";
import StaffLayout from "./pages/admin/StaffLayout"; 
import StaffDashboard from "./pages/admin/StaffDashboard";


import "./style.css";
import RoomsDataDetails from "./pages/admin/RoomsDataDetails";
import OccupantDataDetails from "./pages/admin/OccupantDataDetails";

export default function App() {
  // Ganti dataLoggedIn menjadi staffData sesuai yang ada di Provider
  const { isLoggedIn, staffData } = useAppContext(); 

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {isLoggedIn && (
        <>
          {/* Manager Routes */}
          {staffData?.role === "MANAGER" && (
            <Route path="/dashboard/manager" element={<StaffLayout />}>
              <Route index element={<h1>Manager Overview</h1>} />
              <Route path="laporan" element={<h1>Laporan Keuangan</h1>} />
              <Route path="tambah-kost" element={<h1>Tambah Kost</h1>} />
            </Route>
          )}

          {/* Staff Routes */}
          {staffData?.role === 'STAFF' && (
            <Route path="/dashboard/staff/:staffId" element={<StaffLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route path="kamar" element={<RoomsDataDetails />} />
              <Route path="penghuni" element={<OccupantDataDetails />} />
            </Route>
          )}
        </>
      )}

      <Route path="*" element={<Navigate to={isLoggedIn ? (staffData?.role === "MANAGER" ? "/dashboard/manager" : `/dashboard/staff/${staffData?.id}`) : "/login"} />} />
    </Routes>
  );
}