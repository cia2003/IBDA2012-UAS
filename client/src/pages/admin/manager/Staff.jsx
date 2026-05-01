import { ContactRound, UserCog, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useManagerContext } from "../../../hook/useContext";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";

function Staff() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const { getStaffData, editStaff, deleteStaff } = useManagerContext();

  useEffect(() => {
    const fetchStaff = async () => {
      const data = await getStaffData();
      if (data) {
        setStaff(data);
      }
    };
    fetchStaff();
  }, [getStaffData]);

  const handleEditStaff = async (id) => {
    navigate(`/dashboard/manager/staff-form/${id}`);
  };

  const handleDeleteStaff = async (id) => {
    if (id) {
      await deleteStaff(id);
    }
  };
  const handleAddStaff = () => {
    // console.log("Add button di klik");
    navigate("/dashboard/manager/staff-form");
  };

  const columns = [
    { header: "Nama Staff", accessor: "name" },
    {
      header: "Penempatan Kost",
      accessor: "assignedKost",
      cell: (val) => (
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      header: "No Telepon",
      accessor: "telephone",
      cell: (val) => <span className="text-gray-600 font-medium">{val}</span>,
    },
    { header: "Email", accessor: "email" },
    {
      header: "Aksi",
      accessor: "actions",
      // Contoh jika tabel Anda mendukung custom render:
      cell: (_, item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditStaff(item)}
            className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
          >
            <UserCog size={18} />
          </button>
          <button
            onClick={() => handleDeleteStaff(item)}
            className="text-red-600 hover:underline font-semibold text-sm"
          >
            <UserMinus size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 shrink-0">
            <ContactRound size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              List Staff
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Manajemen akun dan penempatan tugas staff lapangan
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <button
            onClick={handleAddStaff}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md active:scale-95 group text-sm"
          >
            <UserPlus
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Tambah Staff Baru</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 sm:p-6 overflow-x-auto">
          <Table columns={columns} data={staff} />
        </div>
      </div>
    </div>
  );
}

export default Staff;
