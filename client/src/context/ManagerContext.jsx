import { createContext, useCallback, useMemo, useState } from "react";
import {
  staff as staffListDummy, // Rename agar tidak bentrok dengan state
  kostData as initialKostDataDummy,
  ROOM_TYPES,
} from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export const ManagerContext = createContext();

export const ManagerContextProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [initialKostData, setInitialKostData] = useState([]);
  const [tipeKost, setTipeKost] = useState([]);
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

  // --- Tambah Tipe Kost (Bukan Gedung) ---
  const addTipeKost = useCallback(
    async (formData) => {
      // try {
      //   const { data } = await api.post("/tambah-tipe", {
      //     name: formData.name,
      //     size: formData.price,
      //     price: formData.price,
      //     description: formData.description,
      //   });
      //   if (data) {
      //     toast.success("Tipe Kamar berhasil ditambahkan");
      //     navigate("/admin/dashboard/manager");
      //   }
      // } catch (error) {
      //   console.error(error.message);
      // }
      toast.success("Tipe baru berhasil ditambahkan")
    },
    [navigate],
  );

  // --- Edit tipe kost ---
  const editTipeKost = useCallback(
    async (editForm) => {
      // try {
      //   const { data } = api.put("/edit-tipe", {
      //     name: formData.name,
      //     size: formData.price,
      //     price: formData.price,
      //     description: formData.description,
      //   });
      //   if (data) {
      //     toast.success("Tipe Kamar berhasil diperbaharui");
      //     navigate("/admin/dashboard/manager");
      //   }
      // } catch (error) {
      //   console.error(error.message);
      // }
      toast.success("Tipe berhasil diperbaharui")
    },
    [navigate],
  );

  // --- Ambil Data Tipe ---
  const getTipeKost = useCallback(async () => {
    try {
      // const {data} = await api.get('tipe-kost')
      // if(data){
      //   setTipeKost(data || [])
      // }
      // return data

      const data = Array.isArray(ROOM_TYPES)
        ? ROOM_TYPES
        : Object.values(ROOM_TYPES);
      return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  });

  // --- Ambil berdasarkan Id ---
  const getTipeById = useCallback(async (id) => {
    try {
      // const { data } = await api.get(`/tipe-kost/${id}`);
      // if (data) {
      //   return data;
      // }

      const dataArray = Object.values(ROOM_TYPES);

      console.log("Mencari ID:", id);
      console.log("Data tersedia:", dataArray);

      const findTipe = dataArray.find(
        (tipe) => String(tipe.id).trim() === String(id).trim(),
      );

      if (!findTipe) {
        console.error("Hasil: Tipe tidak ditemukan untuk ID", id);
        return null;
      }

      return findTipe;
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  // --- TAMBAH STAFF ---
  const addStaff = useCallback(
    async (staffForm) => {
      try {
        // -- MODE BACKEND --
        // const response = await api.post("/add-staff", staffForm);
        // if (response.data) {
        //   toast.success("Staff Berhasil Ditambahkan");
        //   navigate("/admin/dashboard/manager");
        // }

        // -- MODE DUMMY --
        toast.success("Staff Berhasil Ditambahkan (Dummy)");
        navigate("/admin/dashboard/manager");
      } catch (error) {
        toast.error(error.response?.data?.message || "Staff gagal ditambahkan");
      }
    },
    [navigate],
  );

  // --- EDIT KOST ---
  const editKost = useCallback(
    async (kostId, kostForm) => {
      try {
        // -- MODE BACKEND --
        // const response = await api.put(`/edit-kost/${kostId}`, kostForm);
        // if (response.data) {
        //   toast.success("Kost Berhasil Diperbaharui");
        // }

        // -- MODE DUMMY --
        toast.success("Kost Berhasil Diperbaharui (Dummy)");
        navigate("/admin/dashboard/manager");
      } catch (error) {
        toast.error("Kost gagal diperbaharui");
        console.error(error.message);
      }
    },
    [navigate],
  );

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
      addTipeKost,
      editTipeKost,
      tipeKost,
      getStaffData,
      getKostData,
      addKost,
      deleteKost,
      editKost,
      deleteStaff,
      editStaff,
      getStaffById,
      getTipeKost,
      getKostById,
      getTipeById,
      addStaff,
    }),
    [
      getTipeKost,
      addTipeKost,
      editTipeKost,
      tipeKost,
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
    ],
  );

  return (
    <ManagerContext.Provider value={values}>{children}</ManagerContext.Provider>
  );
};
