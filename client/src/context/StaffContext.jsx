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
import api from "../api/api";
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
      // const response = await api.get(`/get-kost-by-staff/${staffId}`);
      // if(response.data){
      //   setManagedKost(response.data);
      //   return response.data;
      // }

      // -- MODE DUMMY --
      const data = initialKostData.find((t) => String(t.staffId) === String(staffId));
      if (data) {
        setManagedKost(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- UPDATE ROOM STATUS ---
  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.put(`/update-room-status/${roomId}`, { status });
      // if(response.data) toast.success('Status kamar diperbaharui');

      // -- MODE DUMMY --
      toast.success(`Kamar ${roomId} kini ${status} (Dummy)`);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ADD ROOM ---
  const addRoom = useCallback(async (roomForm) => {
    try {
      // -- MODE BACKEND --
      // await api.post("/add-room", roomForm);

      toast.success("Kamar berhasil ditambahkan");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- EDIT TENANT ---
  const editTenant = useCallback(async (tenantId, formData) => {
    try {
      // -- MODE BACKEND --
      // await api.put(`/edit-tenant/${tenantId}`, formData);

      toast.success("Data penghuni diperbaharui");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- DELETE TENANT ---
  const deleteTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      // await api.delete(`/delete-tenant/${tenantId}`);

      toast.success("Penghuni Berhasil Dihapus");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET NEW TENANT LIST (ANTRIAN) ---
  const getNewTenantList = useCallback(async (kostId) => {
    if (!kostId) return;
    try {
      // -- MODE BACKEND --
      // const response = await api.get(`/new-tenants/${kostId}`);
      // setNewTenantList(response.data || []);

      // -- MODE DUMMY --
      const data = initialNewTenantDummy.filter((t) => String(t.requestedKostId) === String(kostId));
      setNewTenantList(data);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ACCEPT TENANT ---
  const acceptTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      // await api.post(`/accept-tenant/${tenantId}`);

      toast.success("Permintaan diterima");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- REJECT TENANT ---
  const rejectTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      // await api.delete(`/reject-tenant/${tenantId}`);

      toast.success("Permintaan ditolak");
    } catch (error) {
      console.error(error.message);
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
      deleteTenant,
      getKostDataByStaffId,
      editTenant,
      updateRoomStatus,
      acceptTenant,
      rejectTenant,
      getNewTenantList,
      getTenantById,
      addRoom,
    }),
    [newTenantList, managedKost, tenantData, deleteTenant, getKostDataByStaffId, editTenant, updateRoomStatus, acceptTenant, rejectTenant, getNewTenantList, getTenantById, addRoom]
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};