import { UserCheck, Check, X, Phone, Search, ChevronDown } from "lucide-react";
import { useAppContext } from "../../../hook/useContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../components/Table";
import toast from "react-hot-toast";

function NewTenantList() {
  const { staffId } = useParams();
  const { fetchNewTenants, rooms } = useAppContext();
  const [searchNewTenant, setSearchNewTenant] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All"); // Default ke "All"
  const [tenants, setTenants] = useState([]);

  const currentKost = rooms[0];
  const kostId = currentKost?.id;

  useEffect(() => {
    if (kostId) {
      // console.log("Fetching tenants for Kost ID:", kostId);
      const data = fetchNewTenants(kostId);
      setTenants(data || []);
    } else {
      // console.log("kostId is still undefined, waiting...");
    }
  }, [kostId, fetchNewTenants]);

  // LOGIKA FILTER: Menggabungkan Search dan Gender Filter
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchNewTenant.toLowerCase());
    const matchesGender =
      selectedFilter === "All" || t.gender === selectedFilter;

    return matchesSearch && matchesGender;
  });

  // Logika Accept Tenant
  const handleAccept = (tenant) => {
    const acceptAction = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Logika API nanti di sini
        resolve(tenant.name);
      }, 1500);
    });

    toast.promise(acceptAction, {
      loading: `Memproses pendaftaran ${tenant.name}...`,
      success: (name) => `Tenan ${name} berhasil diterima!`,
      error: "Gagal memproses pendaftaran.",
    });
  };

  const handleReject = (tenant) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">
            Tolak pendaftaran <b>{tenant.name}</b>?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.error(`Pendaftaran ${tenant.name} ditolak`);
              }}
              className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
            >
              Ya, Tolak
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  };

  const columns = [
    {
      header: "Nama Pendaftar",
      accessor: "name",
      cell: (val, item) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 tracking-tight">{val}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            {item.asal}
          </span>
        </div>
      ),
    },
    {
      header: "Tanggal Pengajuan",
      accessor: "entryDate",
      cell: (val) => (
        <span className="text-gray-500 font-medium font-semibold">
          {new Date(val).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },

    {
      header: "Kontak",
      accessor: "phoneNumber",
      cell: (val) => (
        <div className="flex items-center gap-2 text-blue-600">
         <span className="text-gray-600 font-medium">{val}</span>,
        </div>
      ),
    },
    {
      header: "Aksi",
      accessor: "id",
      cell: (id, item) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100"
            onClick={() => handleAccept(item)}
          >
            <Check size={16} />
          </button>
          <button
            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-100"
            onClick={() => handleReject(item)}
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            <UserCheck size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
              Pendaftaran Masuk
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium italic">
              {currentKost?.name || "Memuat Lokasi..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
          {/* Input Search */}
          <div className="relative group w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Calon Penghuni..."
              value={searchNewTenant}
              onChange={(e) => setSearchNewTenant(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all w-full lg:w-64"
            />
          </div>

          {/* Select Filter */}
          <div className="relative group w-full">
            <select
              className="pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 outline-none appearance-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all cursor-pointer w-full lg:w-48"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="All">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 sm:p-6 overflow-x-auto">
          {filteredTenants.length > 0 ? (
            <Table columns={columns} data={filteredTenants} />
          ) : (
            <div className="py-16 sm:py-20 text-center">
              <h3 className="text-gray-900 font-bold">Data tidak ditemukan</h3>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">
                Coba sesuaikan kata kunci atau filter kamu
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Pendaftar
          </p>
          <p className="text-xs text-gray-500 font-bold">
            <span className="text-blue-600">{filteredTenants.length} </span>
            <span className="text-gray-300 mx-1">/</span> {tenants.length} orang
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewTenantList;