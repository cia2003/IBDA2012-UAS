import { useNavigate } from "react-router-dom";
import { VectorSquare, CircleArrowRight, HousePlus } from "lucide-react";
import Table from "../../../components/ui/Table";
import { useManagerContext } from "../../../hook/useContext";
import { useEffect, useState, useCallback } from "react";

function TipeKost() {
  const [tipeData, setTipeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { getTipeKost } = useManagerContext();

  const fetchTipeData = useCallback(async () => {
    try {
      const data = await getTipeKost();
      if (data) {
        setTipeData(data);
        return data;
      }      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getTipeKost]);

  useEffect(() => {
    fetchTipeData();
  }, [fetchTipeData]);

  const columns = [
    {
      header: "Nama Tipe",
      accessor: "name",
    },
    {
      header: "Ukuran Tipe",
      accessor: "size",
      // Menambahkan satuan m² jika belum ada
      cell: (size) => <span className="font-medium">{size} m²</span>,
    },
    {
      header: "Harga Tipe",
      accessor: "price",
      cell: (price) => (
        <span className="text-blue-600 font-bold">
          Rp {Number(price).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: "id",
      cell: (id) => (
        <div className="flex justify-center">
          <button
            onClick={() =>
              navigate(`/admin/dashboard/manager/tipe-kost-detail/${id}`)
            }
            className="group flex items-center gap-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-blue-100"
          >
            <span>Detail</span>
            <CircleArrowRight
              size={16}
              className="opacity-0 w-0 -translate-x-2 group-hover:opacity-100 group-hover:w-4 group-hover:translate-x-0 transition-all duration-300"
            />
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
            <VectorSquare size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Daftar Kost
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Monitoring seluruh aset properti yang terdaftar
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => navigate("/admin/dashboard/manager/add-tipe")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md active:scale-95 group text-sm"
          >
            <HousePlus
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Tambah Tipe Baru</span>
          </button>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 sm:p-6 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-gray-500 font-medium">
              Memuat ulang...
            </div>
          ) : (
            <Table columns={columns} data={tipeData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default TipeKost;
