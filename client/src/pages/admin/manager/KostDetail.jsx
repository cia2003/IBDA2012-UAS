import { useParams, useNavigate } from "react-router-dom";
import { useManagerContext } from "../../../hook/useContext";
import { useCallback, useEffect, useState } from "react";
import { MapPin, User, Trash2, ArrowLeft, Bed, House } from "lucide-react";

function KostDetail() {
  const { kostId } = useParams();
  const navigate = useNavigate();
  const { getKostById, deleteKost, editKost, getStaffByKostId } = useManagerContext();
  const [kostDetail, setKostDetail] = useState(null);
  const [staffDetail, setStaffDetail] = useState(null);

  const fetchKostDetail = useCallback(async () => {
    const data = await getKostById(kostId);
    setKostDetail(data);
  }, [kostId, getKostById]);

  const fetchStaffDetail = useCallback(async () => {
    const staff = await getStaffByKostId(kostId);
    setStaffDetail(staff || []); // Pastikan selalu berupa array, meskipun tidak ada staff yang ditemukan
  }, [kostId, getStaffByKostId]);

  useEffect(() => {
    fetchKostDetail();
    fetchStaffDetail();
  }, [fetchKostDetail, fetchStaffDetail]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus properti kost ini secara permanen?",
      )
    ) {
      const success = await deleteKost(kostId);
      if (success) {
        navigate("/admin/dashboard/manager/kost");
      }
    }
  };

  if (!kostDetail) {
    return (
      <div className="p-10 text-center animate-pulse text-gray-400">
        Memuat detail properti...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button & Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="bg-gray-100 aspect-video lg:aspect-auto flex items-center justify-center relative overflow-hidden group">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
            <House size={48} className="text-gray-300 relative z-10" /> */}

            <img src={kostDetail.image} alt="" />
          </div>

          {/* Content Info */}
          <div className="p-8 lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {kostDetail.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mt-2 font-medium">
                <MapPin size={18} className="text-blue-500" />
                <span>{kostDetail.address}</span>
              </div>

              <div className="grid grid-cols lg:grid-cols-2 gap-2 mt-5 w-fit">
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-50 text-red-600 gap-2 hover:bg-red-600 hover:text-white px-4 py-2 rounded-2xl transition-all duration-300 font-bold text-sm border border-red-100"
                >
                  <Trash2 size={16} /> Hapus Kost
                </button>
                <button
                  onClick={()=>navigate(`/admin/dashboard/manager/edit-kost/${kostId}`)}
                  className="flex items-center bg-yellow-50 text-yellow-600 gap-2 hover:bg-yellow-600 hover:text-white px-4 py-2 rounded-2xl transition-all duration-300 font-bold text-sm border border-yellow-100"
                >
                  <Trash2 size={16} /> Edit Kost
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                  Pengelola
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} className="text-blue-600" />
                  <span className="font-bold text-sm">
                    {/* Staff ID: {staffDetail.user || "Belum Ditugaskan"} */}
                    <div className="flex flex-col gap-1">
                      {staffDetail?.length > 0 ? (
                        staffDetail.map((staff) => (
                          <div
                            key={staff.userId}
                            className="bg-white px-3 py-2 rounded-xl border border-gray-200"
                          >
                            <p className="font-bold text-sm text-gray-800">
                              {staff.name}
                            </p>
                          </div>
                        ))
                      ) : (
                        <span className="font-bold text-sm text-gray-400">
                          Belum Ditugaskan
                        </span>
                      )}
                    </div>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                  Kapasitas
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed size={16} className="text-purple-600" />
                  <span className="font-bold text-sm">
                    {kostDetail.rooms?.length || 0} Kamar Total
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Kamar */}
      <div className="pt-4">
        <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          Daftar Kamar{" "}
          <span className="bg-blue-100 text-blue-700 text-xs py-1 px-3 rounded-full">
            {kostDetail.rooms?.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kostDetail.rooms?.map((room) => (
            <div
              key={room.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-gray-900">
                  #{room.roomNumber}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${room.status === "Available" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}
                />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Status
              </p>
              <p
                className={`text-sm font-black ${room.status === "Available" ? "text-green-600" : "text-red-600"}`}
              >
                {room.status === "Available" ? "Tersedia" : "Terisi"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KostDetail;
