import { createContext, useCallback, useMemo, useState } from "react";
import {
  staff as staffListDummy, // Rename agar tidak bentrok dengan state
  kostData as initialKostDataDummy,
  ROOM_TYPES,
  staff,
} from "../assets/assets";
import toast from "react-hot-toast";
import { Form, useNavigate } from "react-router-dom";
import api from "../api/api";
import { formDataApi } from "../api/api";
import { useAppContext } from "../hook/useContext";

export const ManagerContext = createContext();

export const ManagerContextProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [initialKostData, setInitialKostData] = useState([]);
  const [tipeKost, setTipeKost] = useState([]);
  const { userRegister } = useAppContext();
  const navigate = useNavigate();

  // --- FETCHING DATA USERS ---
  const getUsersData = useCallback(async () => {
    try {
      const response = await api.get('/users/');
      return response.data.users || [];
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      // toast.error("Gagal mengambil data pengguna");
    }
  }, []);

  // --- FETCHING DATA STAFF ---
  const getStaffData = useCallback(async () => {
    try {
      // -- MODE BACKEND --
      const response = await api.get('employees/');
      const { employees } = response.data;

      if (employees) {
        const staffOnly = employees.filter((staff) => staff.position === "staff");
        setStaffList(staffOnly);
        return staffOnly;
      }

      // -- MODE DUMMY --
      // return staffListDummy;
    } catch (error) {
      console.error(error);
      // toast.error("Gagal mengambil data staff");
    }
  }, []);

  // --- FETCHING DATA KOST ---
  const getKostData = useCallback(async () => {
    try {
      // -- MODE BACKEND --
      const response = await formDataApi.get('kosts/');
      const { kosts } = response.data;

      if(kosts) {
        setInitialKostData(kosts);
        return kosts;
      }

      // -- MODE DUMMY --
      // return initialKostDataDummy;
    } catch (error) {
      // toast.error("Data kost gagal dimuat");
      // console.error(error.message);
    }
  }, []);

  // --- TAMBAH KOST ---
  const addKost = useCallback(async (kostForm) => {
    try {
      // -- MODE BACKEND --
      const formData = new FormData();
      formData.append("name", kostForm.name);
      formData.append("address", kostForm.address);
      formData.append("description", kostForm.description);
      if (kostForm.image) {
        formData.append("image", kostForm.image);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await formDataApi.post("kosts/", formData);
      if (response.data) {
        toast.success("Kost Berhasil Ditambahkan");
        return response.data;
      }

      // -- MODE DUMMY --
      // toast.success("Kost Berhasil Ditambahkan (Dummy)");
    } catch (error) {
      const errors = error.response?.data || {};
      const errorMessages = Object.values(errors).flat();
      toast.error(errorMessages.join("\n") || "Kost gagal ditambahkan");
    }
  }, []);

  // --- AMBIL KOST BY ID ---
  const getKostById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      const response = await formDataApi.get(`kosts/${id}`);
      return response.data;

      // -- MODE DUMMY --
      // return initialKostDataDummy.find((k) => String(k.id) === String(id));
    } catch (error) {
      toast.error("Data Kost gagal dimuat");
      console.error(error.message);
    }
  }, []);

  // --- Tambah Tipe Kost (Bukan Gedung) ---
  const addTipeKost = useCallback(
    async (formData) => {
      try {
        const { data } = await formDataApi.post("roomtypes/", {
          name: formData.name,
          size: formData.price,
          price: formData.price,
          description: formData.description,
        });
        if (data) {
          toast.success("Tipe Kamar berhasil ditambahkan");
          navigate("/admin/dashboard/manager");
        }
      } catch (error) {
        console.error(error.message);
      }
      toast.success("Tipe baru berhasil ditambahkan")
    },
    [navigate],
  );

  // --- Edit tipe kost ---
  const editTipeKost = useCallback(
    async (editForm) => {
      try {
        const { data } = await formDataApi.put(`roomtypes/${editForm.id}/`, {
          name: editForm.name,
          size: editForm.price,
          price: editForm.price,
          description: editForm.description,
        });
        if (data) {
          toast.success("Tipe Kamar berhasil diperbaharui");
          navigate("/admin/dashboard/manager");
        }
      } catch (error) {
        console.error(error.message);
      }
      toast.success("Tipe berhasil diperbaharui")
    },
    [navigate],
  );

  // --- Ambil Data Tipe ---
  const getTipeKost = useCallback(async () => {
    try {
      const response = await formDataApi.get('roomtypes/');
      const { roomtypes } = response.data;

      if(roomtypes) {
        setTipeKost(roomtypes || []);
        return roomtypes;
      }

      // const data = Array.isArray(ROOM_TYPES)
      //   ? ROOM_TYPES
      //   : Object.values(ROOM_TYPES);
      // return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  });

  // --- Ambil berdasarkan Id ---
  const getTipeById = useCallback(async (id) => {
    try {
      const response = await formDataApi.get(`roomtypes/${id}`);
      const { data } = response.data;
      if (data) {
        return data;
      }

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
        const userData = {
          "first_name": staffForm.firstName,
          "last_name": staffForm.lastName,
          "email": staffForm.email,
          "password": staffForm.password,
          "is_staff": true
        };

        const user = await userRegister(userData);

        if (user) {
          toast.success("User untuk staff berhasil dibuat");

          const userId = user?.id;
          let staffData;

          if (staffForm.assignedKostId) {
            staffData = {
              "user": userId,
              "kost": staffForm.assignedKostId,
              "position": staffForm.position,
              "phone_number": staffForm.phoneNumber
            };
          } else {
            staffData = {
              "user": userId,
              "position": staffForm.position,
              "phone_number": staffForm.phoneNumber
            };
          }

          const staffResponse = await api.post("employees/", staffData);

          console.log("Response dari penambahan staff:", staffResponse);

          if (staffResponse?.data) {
            toast.success("Staff Berhasil Ditambahkan");
            navigate("/admin/dashboard/manager");
          }
        }

        // -- MODE DUMMY --
        // toast.success("Staff Berhasil Ditambahkan (Dummy)");
        // navigate("/admin/dashboard/manager");
      } catch (error) {
        const errors = error.response?.data || {};
        const errorMessages = Object.values(errors).flat();
        toast.error(errorMessages.join("\n") || "Staff gagal ditambahkan");
        // toast.error(error.response?.data?.message || "Staff gagal ditambahkan");
      }
    },
    [navigate],
  );

  // --- EDIT KOST ---
  const editKost = useCallback(
    async (kostId, kostForm) => {
      try {
        // -- MODE BACKEND --
        const response = await api.put(`/kosts/${kostId}`, kostForm);
        if (response.data) {
          toast.success("Kost Berhasil Diperbaharui");
        }

        // -- MODE DUMMY --
        // toast.success("Kost Berhasil Diperbaharui (Dummy)");
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
      getUsersData,
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
      getUsersData,
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
