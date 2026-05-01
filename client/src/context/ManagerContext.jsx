import { createContext, useCallback, useMemo } from "react";
import { staff as staffList, kostData as initialKostData } from "../assets/assets"; // Sesuaikan import
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ManagerContext = createContext();

export const ManagerContextProvider = ({ children }) => {
    const navigate = useNavigate()
  
    const getStaffData = useCallback(async () => {
    try {
      const data = await staffList;
      // console.log(data); // Debugging
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data staff");
    }
  }, []);

  const getKostData = useCallback(async () => {
    try {
      return initialKostData;
    } catch (error) {
      toast.error("Data gagal di Fetching");
      console.error(error.message);
    }
  }, []);

  const addKost = useCallback(async (kostForm) => {
    try {
      toast.success("Kost Berhasil Ditambahkan");
    } catch (error) {
      toast.error("Kost gagal ditambahkan ke DB");
      console.error(error.message);
    }
  }, []);

  const addStaff = useCallback(async (staffForm) => {
    try {
      toast.success("Staff Berhasil Ditambahkan");
      navigate('/dashboard/manager')
    } catch (error) {
      toast.error("Staff gagal ditambahkan");
      console.error(error.message);
    }
  }, []);

  const editKost = useCallback(async (kostId)=>{
    try {
      toast.success("Kost Berhasil Diedit");
    } catch (error) {
      toast.error("Kost gagal diedit");
      console.error(error.message);
    }
  },[])

  const editStaff = useCallback(async (staffId)=>{
    try {
      toast.success("Staff Berhasil Diedit");
    } catch (error) {
      toast.error("Staff gagal Diedit");
      console.error(error.message);
    }
  },[])

  const deleteKost = useCallback(async (kostId) => {
    try {
      toast.success("Data Kost berhasil dihapus");
    } catch (error) {
      console.error(error.message);
      toast.error("Kost gagal dihapus");
    }
  }, []);

  const deleteStaff = useCallback(async (staffId) => {
    try {
      toast.success("Data staff berhasil dihapus");
    } catch (error) {
      console.error(error.message);
      toast.error("Staff gagal dihapus");
    }
  }, []);

  const getStaffById = useCallback(async(id)=>{
    try {
        return staff.find((s) => s.id === Number(id));
    } catch (error) {
        
    }
  })

  const values = useMemo(() => ({
    getStaffData,
    getKostData,
    addKost,
    deleteKost,
    editKost,
    deleteStaff,
    editStaff,
    getStaffById,
    addStaff
  }), [getStaffData, addStaff, deleteStaff, getKostData, addKost, deleteKost, editKost, getStaffById, editStaff]);

  return (
    <ManagerContext.Provider value={values}>
      {children}
    </ManagerContext.Provider>
  );
};