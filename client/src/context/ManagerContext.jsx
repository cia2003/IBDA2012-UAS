import { createContext, useCallback, useMemo, useState } from "react";
import {
  staff as staffListDummy, // Rename agar tidak bentrok dengan state
  kostData as initialKostDataDummy,
} from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export const ManagerContext = createContext();

export const ManagerContextProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [initialKostData, setInitialKostData] = useState([]);
  const navigate = useNavigate();

  // --- FETCHING DATA STAFF ---
  const getStaffData = useCallback(async () => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get('/staff-data');
      // if(response.data) {
      //   setStaffList(response.data);
      //   return response.data;
      // }

      // -- MODE DUMMY --
      return staffListDummy;
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data staff");
    }
  }, []);

  // --- FETCHING DATA KOST ---
  const getKostData = useCallback(async () => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get('/kost');
      // if(response.data) {
      //   setInitialKostData(response.data);
      //   return response.data;
      // }

      // -- MODE DUMMY --
      return initialKostDataDummy;
    } catch (error) {
      toast.error("Data kost gagal dimuat");
      console.error(error.message);
    }
  }, []);

  // --- TAMBAH KOST ---
  const addKost = useCallback(async (kostForm) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.post("/add-kost", kostForm);
      // if (response.data) {
      //   toast.success("Kost Berhasil Ditambahkan");
      //   return response.data;
      // }

      // -- MODE DUMMY --
      toast.success("Kost Berhasil Ditambahkan (Dummy)");
    } catch (error) {
      toast.error(error.response?.data?.message || "Kost gagal ditambahkan");
    }
  }, []);

  // --- AMBIL KOST BY ID ---
  const getKostById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get(`/kost/${id}`);
      // return response.data;

      // -- MODE DUMMY --
      return initialKostDataDummy.find((k) => String(k.id) === String(id));
    } catch (error) {
      toast.error("Data Kost gagal dimuat");
      console.error(error.message);
    }
  }, []);

  // --- TAMBAH STAFF ---
  const addStaff = useCallback(async (staffForm) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.post("/add-staff", staffForm);
      // if (response.data) {
      //   toast.success("Staff Berhasil Ditambahkan");
      //   navigate("/dashboard/manager");
      // }

      // -- MODE DUMMY --
      toast.success("Staff Berhasil Ditambahkan (Dummy)");
      navigate("/dashboard/manager");
    } catch (error) {
      toast.error(error.response?.data?.message || "Staff gagal ditambahkan");
    }
  }, [navigate]);

  // --- EDIT KOST ---
  const editKost = useCallback(async (kostId, kostForm) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.put(`/edit-kost/${kostId}`, kostForm);
      // if (response.data) {
      //   toast.success("Kost Berhasil Diperbaharui");
      // }

      // -- MODE DUMMY --
      toast.success("Kost Berhasil Diperbaharui (Dummy)");
    } catch (error) {
      toast.error("Kost gagal diperbaharui");
      console.error(error.message);
    }
  }, []);

  // --- EDIT STAFF ---
  const editStaff = useCallback(async (staffId, staffForm) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.put(`/edit-staff/${staffId}`, staffForm);
      // if(response.data) {
      //   toast.success("Staff Berhasil Diperbaharui");
      // }

      // -- MODE DUMMY --
      toast.success("Staff Berhasil Diperbaharui (Dummy)");
    } catch (error) {
      toast.error("Staff gagal diperbaharui");
    }
  }, []);

  // --- DELETE KOST ---
  const deleteKost = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.delete(`/delete-kost/${kostId}`);
      // if(response.data) {
      //   toast.success("Data Kost berhasil dihapus");
      //   return true;
      // }

      // -- MODE DUMMY --
      toast.success("Data Kost berhasil dihapus (Dummy)");
      return true;
    } catch (error) {
      toast.error("Kost gagal dihapus");
      console.error(error.message);
    }
  }, []);

  // --- DELETE STAFF ---
  const deleteStaff = useCallback(async (staffId) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.delete(`/delete-staff/${staffId}`);
      // if(response.data) {
      //   toast.success("Data staff berhasil dihapus");
      // }

      // -- MODE DUMMY --
      toast.success("Data staff berhasil dihapus (Dummy)");
    } catch (error) {
      toast.error("Staff gagal dihapus");
    }
  }, []);

  // --- AMBIL STAFF BY ID ---
  const getStaffById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get(`/staff/${id}`);
      // return response.data;

      // -- MODE DUMMY --
      return staffListDummy.find((s) => s.id === Number(id));
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const values = useMemo(
    () => ({
      getStaffData,
      getKostData,
      addKost,
      deleteKost,
      editKost,
      deleteStaff,
      editStaff,
      getStaffById,
      getKostById,
      addStaff,
    }),
    [getStaffData, getKostData, addKost, deleteKost, editKost, deleteStaff, editStaff, getStaffById, getKostById, addStaff]
  );

  return (
    <ManagerContext.Provider value={values}>{children}</ManagerContext.Provider>
  );
};