import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./hook/useAppContext";

import Login from "./pages/Login";
import Layout from "./pages/admin/Layout"; 
import Dashboard from "./pages/admin/Dashboard";
import RoomsDataDetails from "./pages/admin/RoomsDataDetails";
import OccupantDataDetails from "./pages/admin/OccupantDataDetails";
import OccupantForm from "./components/OccupantForm";
import RoomForm from "./components/RoomForm"

import "./style.css";
import NewTenantList from "./pages/admin/NewTenantList";

export default function App() {
  const { isLoggedIn, staffData } = useAppContext(); 

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isLoggedIn && (
          <>
            <Route path="/dashboard/:staffId" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="kamar" element={<RoomsDataDetails />} />
                <Route path="penghuni" element={<OccupantDataDetails />} />
                <Route path="edit-penghuni/:occupantId" element={<OccupantForm />} />
                <Route path="tambah-kamar" element={<RoomForm />} />
                <Route path="penghuni-baru" element={<NewTenantList />} />
              </Route>
          </>
        )}
        <Route path="*" element={<Navigate to={isLoggedIn ? (`/dashboard/${staffData?.id}`) : "/login"} />} />
      </Routes>
    </>
  );
}