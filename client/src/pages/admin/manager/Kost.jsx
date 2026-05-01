import { Building2, HousePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useManagerContext } from "../../../hook/useContext";
import Table from "../../../components/Table";

function Kost() {
  const [kost, setKost] = useState([]);
  const { getKostData } = useManagerContext();

  useEffect(() => {
    const fetchKostData = async () => {
      const data = await getKostData();
      if (data) {
        const processedData = data.map((k) => ({
          ...k,
          roomCount: `${k.rooms?.length || 0} Kamar`,
        }));
        setKost(processedData);
      }
    };
    fetchKostData();
  }, [getKostData]);

  const columns = [
    { header: "Nama Kost", accessor: "name" },
    { header: "Alamat", accessor: "address" },
    {
      header: "Jumlah Kamar",
      accessor: "roomCount",
    },
    // Aku belum tahu action Kost apaan
  ];
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 shrink-0">
            <Building2 size={24} className="sm:w-[28px] sm:h-[28px]" />
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
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md active:scale-95 group text-sm">
            <HousePlus
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Tambah Kost Baru</span>
          </button>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 sm:p-6 overflow-x-auto">
          <Table columns={columns} data={kost} />
        </div>
      </div>
    </div>
  );
}

export default Kost;
