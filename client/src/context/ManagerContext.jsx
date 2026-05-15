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

        const enrichedStaff = await Promise.all(
          staffOnly.map(async (item) => {
            const user = await getUserById(item.user);
            let kost = null;

            if (item.kost && item.kost !== null) {
              kost = await getKostById(item.kost);
            }
  
            return {
              userId: item.user,
              kostId: item.kost,
              name: `${user.first_name} ${user.last_name}`,
              phone_number: item.phone_number,
              assignedKost: kost ? kost.name : "Belum Ditentukan",
              email: user.email,
            };
          })
        );
        setStaffList(enrichedStaff);
        return enrichedStaff;
      }

      // -- MODE DUMMY --
      // return staffListDummy;
    } catch (error) {
      console.error(error);
      // toast.error("Gagal mengambil data staff");
    }
  }, []);

  // --- FETCHING DATA KOST ---
  // const getKostData = useCallback(async () => {
  //   try {
  //     // -- MODE BACKEND --
  //     const response = await formDataApi.get('kosts/');
  //     const { kosts } = response.data;

  //     if(kosts) {
  //       setInitialKostData(kosts);
  //       return kosts;
  //     }

  //     // -- MODE DUMMY --
  //     // return initialKostDataDummy;
  //   } catch (error) {
  //     // toast.error("Data kost gagal dimuat");
  //     // console.error(error.message);
  //   }
  // }, []);

  const getKostData = useCallback(async () => {
    try {
      // -- MODE BACKEND --
      const response = await formDataApi.get('manager/kosts/');

      const data = response.data;

      if(data) {
        setInitialKostData(data);
        return data;
      }

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
      const response = await formDataApi.get(`kosts/${id}/`);
      return response.data;

      // -- MODE DUMMY --
      // return initialKostDataDummy.find((k) => String(k.id) === String(id));
    } catch (error) {
      toast.error("Data Kost gagal dimuat");
      console.error(error.message);
    }
  }, []);

  // --- Dapatkan Fasilitas ---
  const getFacilities = useCallback(async () => {
    try {
      const response = await formDataApi.get('facilities/');
      const { facilities } = response.data;

      if (facilities) {
        return facilities;
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getFacilityById = useCallback(async (id) => {
    try {
      const response = await formDataApi.get(`facilities/${id}/`);
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- Tambah Tipe Kost (Bukan Gedung) ---
  const addTipeKost = useCallback(
    async (roomTypeData) => {
      try {
        const formData = new FormData();
        formData.append("name", roomTypeData.name);
        formData.append("size", roomTypeData.size);
        formData.append("price", roomTypeData.price);

        roomTypeData.facility_ids.forEach((id) => {
          formData.append("facilities", id);
        });

        const response = await formDataApi.post("roomtypes/", formData);

        const data = response.data;

        if (data) {
          toast.success("Tipe Kamar berhasil ditambahkan");
          navigate("/admin/dashboard/manager");
        }
      } catch (error) {
        toast.error("Tipe Kamar gagal ditambahkan");
        console.error(error.message);
      }

    },
    [navigate],
  );

  // --- Edit tipe kost ---
  const editTipeKost = useCallback(
    async (roomTypeData) => {
      try {
        const formData = new FormData();
        formData.append("name", roomTypeData.name);
        formData.append("size", roomTypeData.size);
        formData.append("price", roomTypeData.price);

        roomTypeData.facility_ids.forEach((id) => {
          formData.append("facilities", id);
        });

        const { data } = await formDataApi.put(`roomtypes/${roomTypeData.id}/`, formData);

        if (data) {
          toast.success("Tipe Kamar berhasil diperbaharui");
          navigate("/admin/dashboard/manager");
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    [navigate],
  );

  // --- Ambil Data Tipe ---
  const getTipeKost = useCallback(async () => {
    try {
      const response = await formDataApi.get('roomtypes/');
      const { room_types} = response.data;

      if(room_types) {
        setTipeKost(room_types || []);
        return room_types;
      }

      // const data = Array.isArray(ROOM_TYPES)
      //   ? ROOM_TYPES
      //   : Object.values(ROOM_TYPES);
      // return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }, []);

  // --- Ambil berdasarkan Id ---
  const getTipeById = useCallback(async (id) => {
    try {
      const response = await formDataApi.get(`roomtypes/${id}/`);
      const data = response.data;

      if (data) {
        const roomTypeData = {
          id: data.id,
          name: data.name,
          size: data.size,
          price: data.price,
          facility_ids: Array.isArray(data.facilities)
            ? await Promise.all(data.facilities.map(async (id) => {
                const facilityData = await getFacilityById(id);
                return facilityData ? facilityData.id : null;
              }))
            : [],
            
          facilities: Array.isArray(data.facilities)            
            ? await Promise.all(data.facilities.map(async (id) => {
                const facilityData = await getFacilityById(id);
                return facilityData ? facilityData.name : null;
              }))
            : [],
        };
        
        return roomTypeData;
      }

    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const deleteTipeKost = useCallback(async (tipeId) => {
    try {
      const response = await formDataApi.delete(`roomtypes/${tipeId}/`);
      if (response.status === 204) {
        toast.success("Tipe Kamar berhasil dihapus");
        return true;
      }
    } catch (error) {
      toast.error("Gagal menghapus Tipe Kamar");
      console.error(error.message);
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
        const formData = new FormData();
        formData.append("name", kostForm.name);
        formData.append("address", kostForm.address);
        formData.append("description", kostForm.description);
        if (kostForm.image instanceof File) {
          formData.append("image", kostForm.image);
        }

        const response = await formDataApi.put(`kosts/${kostId}/`, formData);

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
  const editUser = useCallback(async (userId, userForm) => {
    try {
      const response = await api.put(`users/${userId}/`, userForm);
      const data = response.data;

      if (data) {
        toast.success("Data pengguna berhasil diperbaharui")
        return data;
      }
    } catch (error) {
      toast.error("Data pengguna gagal diperbaharui");
      console.error(error.message);
    }
  }, []);

  const editStaff = useCallback(async (staffId, staffForm) => {
    try {
      // -- MODE BACKEND --
        const userData = {
          "first_name": staffForm.firstName,
          "last_name": staffForm.lastName,
          "email": staffForm.email,
          "password": staffForm.password,
        };

        const user = await editUser(staffId, userData);
        
        if (user) {
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

          const staffResponse = await api.put(`employees/${staffId}/`, staffData);
          toast.success("Staff Berhasil Diperbaharui");
        }
      // -- MODE DUMMY --
      // toast.success("Staff Berhasil Diperbaharui (Dummy)");
    } catch (error) {
      toast.error("Staff gagal diperbaharui");
    }
  }, []);

  // --- DELETE KOST ---
  const deleteKost = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await formDataApi.delete(`kosts/${kostId}/`);
      if(response.status === 204) {
        toast.success("Data Kost berhasil dihapus");
        return true;
      }

      // -- MODE DUMMY --
      // toast.success("Data Kost berhasil dihapus (Dummy)");
      // return true;
    } catch (error) {
      toast.error("Kost gagal dihapus");
      console.error(error.message);
    }
  }, []);

  // --- DELETE STAFF ---
  const deleteStaff = useCallback(async (staffId) => {
    try {
      // -- MODE BACKEND --
      const responseEmployee = await api.delete(`employees/${staffId}/`);
      const responseUser = await api.delete(`users/${staffId}/`);

      if(responseEmployee.status === 204 && responseUser.status === 204) {
        toast.success("Data staff berhasil dihapus");
      }

      // -- MODE DUMMY --
      // toast.success("Data staff berhasil dihapus (Dummy)");
    } catch (error) {
      toast.error("Staff gagal dihapus");
    }
  }, []);

  const getStaffByKostId = useCallback(async (kostId) => {
    try {

      const response = await api.get(`employees/?kost=${kostId}`);
      const { employees } = response.data;

      if (employees) {
        const staffOnly = employees.filter((staff) => staff.position === "staff");
        const enrichedStaff = await Promise.all(
          staffOnly.map(async (item) => {
            const user = await getUserById(item.user);
            return {
              userId: item.user,
              kostId: item.kost,
              name: `${user.first_name} ${user.last_name}`,
              phone_number: item.phone_number,
              email: user.email,
            };
          })
        );
        return enrichedStaff;
      }
    } catch (error) {
      console.error("Gagal mengambil data staff:", error);
      return [];
    }
  }, []);

  // --- AMBIL STAFF BY ID ---
  const getStaffById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`employees/${id}/`);
      const getUser = await getUserById(response.data.user);

      let getKost = null;
      if (response.data.kost && response.data.kost !== null) {
        getKost = await getKostById(response.data.kost);
      }
      
      if (response.data && getUser) {
        return {
          userId: response.data.user,
          kostId: response.data.kost,
          firstName: getUser.first_name || "",
          lastName: getUser.last_name || "",
          position: response.data.position || "",
          phoneNumber: response.data.phone_number || "",
          assignedKostId: response.data.kost || "",
          email: getUser.email || "",
          password: "", // Password tidak dikembalikan untuk keamanan
        };
      }

      // -- MODE DUMMY --
      // return staffListDummy.find((s) => s.id === Number(id));
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getUserById = useCallback(async (id) => {
    try {
      const response = await api.get(`users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const values = useMemo(
    () => ({
      getFacilities,
      getFacilityById,
      addTipeKost,
      editTipeKost,
      deleteTipeKost,
      tipeKost,
      getUsersData,
      getStaffData,
      getStaffByKostId,
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
      getFacilities,
      getFacilityById,
      getTipeKost,
      addTipeKost,
      editTipeKost,
      deleteTipeKost,
      tipeKost,
      getUsersData,
      getStaffData,
      getStaffByKostId,
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
