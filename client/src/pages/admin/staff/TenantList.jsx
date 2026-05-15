import { useCallback, useEffect, useState } from "react";
import Table from "../../../components/ui/Table";
import { useAppContext, useStaffContext } from "../../../hook/useContext";
import {
  Users,
  Search,
  UserCog,
  UserMinus,
  Filter,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { staff } from "../../../assets/assets";

function TenantList() {
  const { staffId, occupantId } = useParams();
  const { deleteTenant, deleteLease, getKostDataByStaffId, managedKost } = useStaffContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("All");
  const navigate = useNavigate();

  const kostData = managedKost?.managedKost || [];

  const allOccupants = kostData.rooms
    ? kostData.rooms
        .filter(
          (room) => room.status === "Occupied" && Array.isArray(room.resident),
        )
        .flatMap((room) =>
          room.resident.map((person) => ({
            ...person,
            roomNumber: room.roomNumber,
          })),
        )
    : [];

  const filteredOccupants = allOccupants.filter((person) => {
    const matchesSearch = person.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRoom =
      selectedRoom === "All" || person.roomNumber === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  const roomOptions = [
    ...new Set(allOccupants.map((p) => p.roomNumber)),
  ].sort();

  const handleEdit = (item) => {
    navigate(`/admin/dashboard/${staffId}/edit-penghuni/${item.user_id}`);
  };

  const handleDelete = useCallback(
    async (tenant) => {
      const deletePromise = (async () => {
        // 1. delete lease dulu (kalau ada API-nya)
        if (tenant.lease_id) {
          await deleteLease(tenant.lease_id);
          
        }

        // 2. delete tenant
        await deleteTenant(tenant.user_id);

        // 3. Re-render ulang
        await getKostDataByStaffId(staffId);
      })();

      toast.promise(
        deletePromise,
        {
          loading: `Sedang menghapus ${tenant.name}...`,
          success: () => `${tenant.name} berhasil dihapus!`,
          error: (err) => err?.message || `Gagal menghapus ${tenant.name}`,
        },
        {
          style: {
            minWidth: "250px",
            borderRadius: "12px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
          },
        }
      );
    },
    [deleteTenant, deleteLease]
  );

  const columns = [
    {
      header: "Nama Penghuni",
      accessor: "name",
      cell: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <UserCircle size={20} />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">{val}</span>
        </div>
      ),
    },
    {
      header: "No Kamar",
      accessor: "roomNumber",
      cell: (val) => (
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      header: "Kontak",
      accessor: "contact",
      cell: (val) => <span className="text-gray-600 font-medium">{val}</span>,
    },
    {
      header: "Check-in",
      accessor: "checkInDate",
      cell: (val) => (
        <span className="text-gray-500 text-sm">
          {new Date(val).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      cell: (_, item) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              handleEdit(item);
            }}
            className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
            title="Edit Profil"
          >
            <UserCog size={18} />
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Hapus ${item.name} dari kamar ${item.roomNumber}?`,
                )
              ) {
                handleDelete(item);
              }
            }}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Hapus Penghuni"
          >
            <UserMinus size={18} />
          </button>
        </div>
      ),
    },
  ];


  useEffect(()=>{
    const fetchData = async()=>{
      await getKostDataByStaffId(staffId);
    }
    fetchData();
  }, [staffId])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
            <Users size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
              Data Penghuni
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {allOccupants.length} Penghuni Terdaftar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative group w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama penghuni..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all w-full lg:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Room Filter Dropdown */}
          <div className="relative group w-full">
            <select
              className="pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 outline-none appearance-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all cursor-pointer w-full lg:w-48"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="All">Semua Kamar</option>
              {roomOptions.map((roomNum) => (
                <option key={roomNum} value={roomNum}>
                  Kamar {roomNum}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 sm:p-6 overflow-x-auto">
          <Table columns={columns} data={filteredOccupants} />
        </div>

        {filteredOccupants.length === 0 && (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold text-sm">
              Tidak ada hasil ditemukan
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              Coba ubah kata kunci atau filter kamar Anda.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500 font-bold">
            <span className="text-blue-600">{filteredOccupants.length} </span>/{" "}
            {allOccupants.length} orang
          </p>
        </div>
      </div>
    </div>
  );
}

export default TenantList;