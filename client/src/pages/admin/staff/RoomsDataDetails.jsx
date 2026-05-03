import { useState } from "react";
import Table from "../../../components/ui/Table";
import { useAppContext } from "../../../hook/useContext";
import {
  Edit3,
  Trash2,
  BedDouble,
  CirclePlus,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function RoomsDataDetails() {
  const { rooms } = useAppContext();
  const { staffId } = useParams();
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("roomNumber");
  const navigate = useNavigate();

  const currentKost = rooms[0];
  const roomsList = currentKost?.rooms || [];

  const filteredData = roomsList
    .filter((room) => {
      if (filterStatus === "All") return true;
      return room.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "priceLow") return a.price - b.price;
      return a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
      });
    });

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Occupied" : "Available";
    // console.log(`Kamar ID ${id} diubah menjadi ${newStatus}`);
    toast.success(`Status Kamar #${id} diubah menjadi ${newStatus}`);
  };

  const columns = [
    {
      header: "No. Kamar",
      accessor: "roomNumber",
      cell: (val) => <span className="font-bold text-gray-900">#{val}</span>,
    },
    {
      header: "Tipe",
      accessor: "name",
      cell: (value) => (
        <span className="font-medium text-gray-600">{value}</span>
      ),
    },
    {
      header: "Harga / Bulan",
      accessor: "price",
      cell: (value) => (
        <span className="text-blue-600 font-semibold">
          Rp {value.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            value === "Available"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Penghuni",
      accessor: "resident",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded-md text-xs font-bold ${Array.isArray(value) && value.length > 0 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}
          >
            {Array.isArray(value) ? value.length : 0}
          </div>
          <span className="text-gray-400 text-[11px] font-medium uppercase">
            Orang
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      cell: (id, item) => {
        // Cek apakah status saat ini Available
        const isAvailable = item.status === "Available";

        return (
          <div className="flex items-center gap-4">
            <label className="relative inline-flex cursor-pointer items-center group">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAvailable}
                onChange={() => toggleStatus(item.roomNumber, item.status)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            <BedDouble size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
              Daftar Kamar
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {currentKost?.name || "Memuat lokasi..."}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Table Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 border-b border-gray-50 items-center">
          <div className="lg:col-span-8 overflow-x-auto scrollbar-hide">
            <div className="grid md:grid-cols-3 sm:grid-cols-1 bg-gray-100 p-1 rounded-xl w-full max-w-md">
              <button
                onClick={() => setFilterStatus("All")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === "All"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Semua
              </button>

              <button
                onClick={() => setFilterStatus("Available")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === "Available"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Tersedia
              </button>

              <button
                onClick={() => setFilterStatus("Occupied")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === "Occupied"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Terisi
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 py-2.5 pl-4 pr-10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
            >
              <option value="roomNumber">Urutkan: No. Kamar</option>
              <option value="priceHigh">Harga Tertinggi</option>
              <option value="priceLow">Harga Terendah</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="p-2 sm:p-6 overflow-x-auto">
          <Table columns={columns} data={filteredData} />
        </div>

        {/* Footer Info */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50/50 flex flex-row justify-between items-center border-t border-gray-50">
          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Ringkasan Data
          </p>
          <p className="text-xs text-gray-500 font-bold">
            <span className="text-blue-600">{filteredData.length}</span> /{" "}
            {roomsList.length} Kamar
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoomsDataDetails;
