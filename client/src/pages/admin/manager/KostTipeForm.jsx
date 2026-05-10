import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, ArrowLeft, Save } from "lucide-react";
import { useManagerContext } from "../../../hook/useContext";

function KostTipeForm() {
  const navigate = useNavigate();
  const {tipeId} = useParams()

  const [tipe, setTipe] = useState({
    name: "",
    description: "",
    size: "",
    price: "",
  });

  const {addTipeKost, editTipeKost, getTipeById} = useManagerContext()

  // Handler universal untuk semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const facilitiesArray = tipe.description
      .split(",") 
      .map((item) => item.trim()) 
      .filter((item) => item !== ""); 

    const dataToSubmit = {
      ...tipe,
      id: tipeId,
      facilities: facilitiesArray, 
    };

    try {
      if (!tipeId) {
        await addTipeKost(dataToSubmit);
        alert("Tipe kamar berhasil ditambahkan!");
      } else {
        await editTipeKost(dataToSubmit);
        alert("Tipe kamar berhasil diperbarui!");
      }
      navigate(-1);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const fetchTipeEdit = useCallback(async () => {
    if (!tipeId) return;

    try {
      const data = await getTipeById(tipeId);
      if (data) {
        setTipe({
          name: data.name || "",
          // Kembalikan array ke string koma agar bisa dibaca Textarea
          description: Array.isArray(data.facilities) 
            ? data.facilities.join(", ") 
            : data.description || "",
          size: data.size || "",
          price: data.price || "",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data edit:", error.message);
    }
  }, [tipeId, getTipeById]);

  useEffect(() => {
    if (tipeId) {
      fetchTipeEdit();
    }
  }, [fetchTipeEdit, tipeId]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kembali
        </button>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Upload size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Tambah Tipe Kamar
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Konfigurasi spesifikasi dan harga tipe kamar baru
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Tipe */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Nama Tipe
              </label>
              <input
                name="name"
                type="text"
                value={tipe.name}
                onChange={handleChange}
                placeholder="Masukan Nama Tipe Kamar"
                className="border border-gray-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Ukuran Tipe */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Ukuran Kamar (m²)
              </label>
              <input
                name="size"
                type="text"
                value={tipe.size}
                onChange={handleChange}
                placeholder="Contoh: 4x4"
                className="border border-gray-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Harga */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Harga per Bulan
              </label>
              <input
                name="price"
                type="number"
                value={tipe.price}
                onChange={handleChange}
                placeholder="Masukkan nominal harga"
                className="border border-gray-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Deskripsi Fasilitas
            </label>
            <textarea
              name="description"
              rows="4"
              value={tipe.description}
              onChange={handleChange}
              placeholder="Sebutkan fasilitas tipe kamar ini..."
              className="border border-gray-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-gray-50 p-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Save size={18} /> Simpan Tipe Kamar
          </button>
        </div>
      </form>
    </div>
  );
}

export default KostTipeForm;
