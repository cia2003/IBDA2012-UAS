import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { 
  kostData as initialKostData, 
  newTenant as initialNewTenantDummy 
} from "../assets/assets";
import toast from "react-hot-toast";
import api, { formDataApi } from "../api/api";
import { AppContext } from "./AppContext";

export const StaffContext = createContext();

export const StaffContextProvider = ({ children }) => {
  const { staffData } = useContext(AppContext)
  
  const [newTenantList, setNewTenantList] = useState([]);
  const [managedKost, setManagedKost] = useState(null);
  const [tenantData, setTenantData] = useState(null);

  // --- GET KOST DATA BY STAFF ID ---
  const getKostDataByStaffId = useCallback(async (staffId) => {
    if (!staffId) return;

    try {
      // -- MODE BACKEND --

      const response = await formDataApi.get(`staff/${staffId}/kost/`);

      if (response.data) {
        setManagedKost(response.data);
      }

      return response.data

    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getRoomListProduction = useCallback(async (kostId) => {
    try {
      const response = await api.get(`kosts/${kostId}/rooms/`);
      const data = response.data;

      if (data) {
        setManagedKost((prev) => ({
          ...prev,
          rooms: response.data.rooms ?? response.data,
        }));
      }

      return data      
    } catch (error) {
      console.error(error.message);
      return null;
    }

  }, []); 

  const getStaffDataByKostId = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`kosts/${kostId}/contact/`); // Asumsikan endpoint ini mengembalikan daftar kontak staff berdasarkan ID kost
      const employee = response.data; // Asumsikan response mengandung field employees yang merupakan array staff

      return employee
      
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }, []);

  // --- UPDATE ROOM STATUS ---
  const updateRoomStatus = useCallback(async (roomId, isAvailable) => {
    try {
      const response = await api.put(`rooms/${roomId}/`, {
        is_available: isAvailable,
      });

      if (response.data) {
        toast.success("Status kamar diperbaharui");

        setManagedKost((prev) => {
          if (!prev?.managedKost) return prev;

          return {
            ...prev,
            managedKost: {
              ...prev.managedKost,
              rooms: prev.managedKost.rooms.map((r) =>
                r.id === roomId
                  ? {
                      ...r,
                      status: isAvailable ? "Available" : "Occupied",
                    }
                  : r
              ),
            },
          };
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ADD ROOM ---
  const addRoom = useCallback(async (roomForm) => {
    try {
      // -- MODE BACKEND --

      const formData = new FormData();
      formData.append('kost', managedKost.id); // Asumsikan managedKost sudah memiliki ID kost yang dikelola
      formData.append('room_type', roomForm.category);
      formData.append('name', roomForm.roomNumber);
      formData.append('image', roomForm.image);
      formData.append('is_available', true); // Set default status kamar menjadi tersedia
      
      const response = await formDataApi.post("rooms/", formData);
      if(response.data) {
        toast.success("Kamar berhasil ditambahkan");
      };
    } catch (error) {
      console.error(error.message);
    }
  }, [managedKost]);

  // Get Room Details by ID (untuk edit)
  const getRoomById = useCallback(async (roomId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`rooms/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // Get Room Details

  const getRoomDetails = useCallback(async (roomId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`rooms/${roomId}/`);
      const data = response.data;

      if (data) {
        // const kostResponse = await api.get(`kosts/${data.kost}/`);
        const resKost = data.kost;

        const result = {
          kostName: resKost.name, 
          roomNumber: data.name
        }

        return result;
      }
      
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // Get All Room 
  const getAllRoomsByKostId = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`rooms/`);
      const { rooms } = response.data; // Asumsikan response mengandung field rooms yang merupakan array semua kamar

      const filteredRooms = rooms.filter((room) => String(room.kost) === String(kostId)); // Filter kamar berdasarkan kostId
      return filteredRooms;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // // --- ACCEPTED LEASE ---
  // const getAcceptedLeases = useCallback(async (kostId) => {
  //   try {
  //     // -- MODE BACKEND --
  //     const response = await api.get(`leases/`); // Asumsikan endpoint ini mengembalikan semua lease
  //     const { leases } = response.data; // Asumsikan response mengandung field leases yang merupakan array semua lease

  //     return leases
  //       .filter((lease) => lease.status === 'accepted'); // Filter lease berdasarkan kostId dan status accepted
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }, []);

  // // --- PENDING LEASE ---
  // const getPendingLeases = useCallback(async (kostId) => {
  //   try {
  //     // -- MODE BACKEND --
  //     const response = await api.get(`leases/`); // Asumsikan endpoint ini mengembalikan semua lease
  //     const { leases } = response.data; // Asumsikan response mengandung field leases yang merupakan array semua lease
  //     const pendingLeases = leases.filter((lease) => String(lease.room.kost) === String(kostId) && lease.status === 'pending');
  //     return pendingLeases;
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }, []);

  // --- EDIT TENANT ---
  const editTenant = useCallback(async (tenantId, formData) => {
    try {
      // -- MODE BACKEND --
      await api.put(`tenants/${tenantId}/`, formData);

      // toast.success("Data penghuni diperbaharui");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- DELETE TENANT ---
  const deleteTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      await api.delete(`tenants/${tenantId}/`);

      // toast.success("Penghuni Berhasil Dihapus");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET ALL TENANT ---
  const getAllTenants = useCallback(async () => { 
    try {
      // -- MODE BACKEND --
      const response = await api.get(`tenants/`); // Asumsikan endpoint ini mengembalikan semua tenant
      const { tenants } = response.data; // Asumsikan response mengandung field tenants yang merupakan array semua tenant
      return tenants;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET NEW TENANT LIST (ANTRIAN) ---
  const getNewTenantList = useCallback(async (kostId) => {
    try {
      if (!kostId) return;

      const leaseResponse = await api.get('leases/nested/'); // Asumsikan endpoint ini mengembalikan semua lease
      const { leases } = leaseResponse.data; // Asumsikan response mengandung field leases yang merupakan array semua lease

      const filteredLeases = leases.filter((lease) => String(lease.room.kost_id) === String(kostId) && lease.status === 'pending'); // Filter lease berdasarkan kostId dan status pending
      setNewTenantList(filteredLeases);

      return filteredLeases;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ACCEPT TENANT ---
  const acceptTenant = useCallback(async (leaseId) => {
    try {
      // -- MODE BACKEND --
      const status = {
        status:'accepted'
      };

      const response = await api.put(`leases/${leaseId}/`, status);

      if (response.data) {
        return response.data;
      }
      // await api.post(`/accept-tenant/${tenantId}`);

    } catch (error) {
      console.error(error.message);
      return null;
    }
  }, []);

  // --- REJECT TENANT ---
  const rejectTenant = useCallback(async (leaseId) => {
    try {
      // -- MODE BACKEND --
      const status = {
        status: 'rejected'
      };

      const response = await api.put(`leases/${leaseId}/`, status);
      // await api.delete(`/reject-tenant/${tenantId}`);

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }, []);

  // --- GET TENANT BY ID ---
  const getTenantById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get(`/tenant/${id}`);
      // return response.data;

      // -- MODE DUMMY --
      for (const kost of initialKostData) {
        for (const room of kost.rooms ?? []) {
          const occupant = room.resident?.find((p) => String(p.id) === String(id));
          if (occupant) {
            return { ...occupant, roomNumber: room.roomNumber, kostName: kost.name };
          }
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // -- NOTIFIKASI TAGIHAN PEMBAYARAN
  // const notifTenantsInvoice = useCallback(async()=>{
  //   try {
  //     const {data} = await api.post('tagih-pembayaran', staffData.idKost) // Dianggap bahwa login sukse mengembalikan data staff berupa id kost tempat ia bekerja
  //     if(data){
  //       toast.success("Notifikasi tagihan pembayaran berhasil dikirimkan")
  //     }else{
  //       toast.error("Tidak ada tenant yang memiliki tagihan pembayaran")
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // })

  // OTOMATIS FETCH DATA SAAT STAFF LOGIN
  useEffect(() => {
    if (staffData && staffData.role === "staff") {
      getKostDataByStaffId(staffData.id);
    }
  }, [staffData, getKostDataByStaffId]);

  // OTOMATIS FETCH ANTRIAN JIKA KOST SUDAH DIDAPAT
  useEffect(() => {
    if (managedKost?.id) {
      getNewTenantList(managedKost.id);
    }
  }, [managedKost, getNewTenantList]);

  const value = useMemo(
    () => ({
      newTenantList,
      managedKost,
      tenantData,
      getRoomDetails,
      getStaffDataByKostId,
      getAllRoomsByKostId,
      // getAcceptedLeases,
      // getPendingLeases,
      getRoomById,
      deleteTenant,
      getKostDataByStaffId,
      editTenant,
      updateRoomStatus,
      acceptTenant,
      rejectTenant,
      getNewTenantList,
      getTenantById,
      addRoom,
      // notifTenantsInvoice
    }),
    [newTenantList, managedKost, tenantData, deleteTenant, getKostDataByStaffId, editTenant, updateRoomStatus, acceptTenant, rejectTenant, getNewTenantList, getTenantById, addRoom, getStaffDataByKostId, getRoomDetails]
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};