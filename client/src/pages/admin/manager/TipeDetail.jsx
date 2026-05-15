import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManagerContext } from "../../../hook/useContext";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Maximize,
  CheckCircle2,
  Info,
  Layers,
} from "lucide-react";

function TipeDetail() {
  const { tipeId } = useParams();
  const navigate = useNavigate();
  const { getTipeById } = useManagerContext();
  const [tipeDetail, setTipeDetail] = useState(null);

  const fetchTipeDetail = useCallback(async () => {
    try {
      const data = await getTipeById(tipeId);
      if (data) setTipeDetail(data);
    } catch (error) {
      console.error("Gagal mengambil detail tipe:", error);
    }
  }, [tipeId, getTipeById]);

  useEffect(() => {
    fetchTipeDetail();
  }, [fetchTipeDetail]);

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tipe kamar ini?")) {
      console.log("Menghapus ID:", tipeId);
      navigate(-1);
    }
  };

  if (!tipeDetail) {
    return (
      <div className="p-20 text-center animate-pulse text-gray-400 font-medium">
        Memuat detail tipe kamar...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
      </div>

      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 shrink-0">
            <Layers size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Spesifikasi Tipe
          </h1>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center bg-red-50 text-red-600 gap-2 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-red-100 shadow-sm"
          >
            <Trash2 size={16} /> Hapus Tipe
          </button>
          <button
            onClick={() => navigate(`/admin/dashboard/manager/edit-tipe/${tipeId}`)}
            className="flex items-center justify-center bg-amber-50 text-amber-600 gap-2 hover:bg-amber-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-amber-100 shadow-sm"
          >
            <Edit3 size={16} /> Edit Tipe
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Essential Info */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <section>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-2">
                <Info size={12} /> Nama Tipe
              </label>
              <p className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {tipeDetail.name}
              </p>
            </section>

            <section>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-2">
                <Maximize size={12} /> Ukuran Kamar
              </label>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-lg">
                {tipeDetail.size} <span className="text-sm font-medium">m²</span>
              </div>
            </section>

            <section className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                Estimasi Harga
              </p>
              <p className="text-2xl font-black text-blue-600">
                Rp {Number(tipeDetail.price).toLocaleString("id-ID")}
                <span className="text-sm text-gray-400 font-medium italic"> /bulan</span>
              </p>
            </section>
          </div>

          {/* Right Colum */}
          <div className="lg:col-span-2 bg-gray-50/50 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-gray-50">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-500" />
              Fasilitas Tipe Kamar
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {tipeDetail.facilities?.length > 0 ? (
                tipeDetail.facilities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-gray-600 font-semibold text-xs md:text-sm">
                      {item}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 italic text-sm">Belum ada fasilitas.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipeDetail;