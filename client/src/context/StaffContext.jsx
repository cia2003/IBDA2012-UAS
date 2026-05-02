import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { staff as initialStaffList } from "../assets/assets";
import toast from "react-hot-toast";

export const StaffContext = createContext();

export const StaffContextProvider = ({ children }) => {
  const [staffList, setStaffList] = useState(initialStaffList);

  const getStaffData = useCallback(() => {
    return staffList;
  }, [staffList]);

  const getStaffById = useCallback(
    (id) => {
      return staffList.find((s) => String(s.id) === String(id)) || null;
    },
    [staffList],
  );

  const deleteStaff = useCallback(async (id) => {
    try {
      setStaffList((prev) => prev.filter((s) => String(s.id) !== String(id)));
      toast.success("Staff berhasil dihapus");
      return true;
    } catch (error) {
      toast.error("Gagal menghapus staff");
      return false;
    }
  }, []);

  // Tambahkan fungsi CRUD staff lainnya di sini (addStaff, editStaff)

  const value = useMemo(
    () => ({
      staffList,
      getStaffData,
      getStaffById,
      deleteStaff,
    }),
    [staffList, getStaffData, getStaffById, deleteStaff],
  );
  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};
