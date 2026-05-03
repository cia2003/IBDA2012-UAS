import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { staff as initialStaffList } from "../assets/assets";
import toast from "react-hot-toast";
// import api from "../api/api"

export const StaffContext = createContext();

export const StaffContextProvider = ({ children }) => {
  const [newTenant, setNewTenant] = useState([])

  // Ambil data kost berdasarkan staff id yang bertugas
  const getKostDataByStaffId = useCallback(async (staffId) => {
    try {
      // const {data} = await api.get(url, {data: staffId})
      // if(data){
      //   console.log(data)
      //    return data
      // }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  // Edit data penghuni
  const editTenant = useCallback(async (tenantId, formData) => {
    try {
      // const { data } = await api.put(url, { tenantId, data:{ formData }});
      // if (data) {
      //   console.log(data);
      //   return data
      //   toast.success("Data penghuni berhasil diperbaharui")
      // }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  // Hapus data penghuni
  const deleteTenant = useCallback(async (tenantId) => {
    try {
      // const { data } = await axios.delete(url, data: {tenantId})
      // if (data){
      //   console.log(data)
      // toast.success("Penghuni Berhasil Dihapus");
      // }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  // Update status (Terisi/Kosong) kamar
  const updateRoomStatus = useCallback(async (room) => {
    try {
      // const {data} = await api.put(url, {data:room.id})
      // if(data){
      // console.log(data)
      // toast.success(`Status kamar ${room.roomNumber} berhasil diperbaharui`)
      // }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  // Ambil data calon penghuni baru
  const getNewTenantList = useCallback(async(staffId)=>{
    try {
      // const {data} = await api.get(url, {data: staffId})
      // if(data){
      //   console.log(data)
      //   setNewTenant(data || [])
      // }
    } catch (error) {
      
    }
  },[])

  // Terima penghuni baru
  const acceptTenant = useCallback(async (tenant) => {
    try {
      // const {data} = await api.put(url, {data: tenant.id})
      // if(data){
      //   console.log(data)
      //   toast.success(`Permintaan Penghuni Baru: ${tenant.name} Diterima`)
      // }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  // Tolak penghuni baru
  const rejectTenant = useCallback(async (tenant) => {
    try {
      const { data } = await api.delete(url, {data: tenant.id});
      if (data) {
        console.log(data);
        toast.success(`Permintaan penghuni ${tenant.name} Ditolak`);
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      newTenant,

      deleteTenant,
      getKostDataByStaffId,
      editTenant,
      updateRoomStatus,
      acceptTenant,
      rejectTenant,
    }),
    [
      deleteTenant,
      getKostDataByStaffId,
      editTenant,
      updateRoomStatus,
      acceptTenant,
      rejectTenant,
      getNewTenantList
    ],
  );
  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};
