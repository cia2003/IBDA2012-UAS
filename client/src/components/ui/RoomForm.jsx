import { use, useState, useEffect } from "react";
import { Upload, ChevronDown, Save, ArrowLeft } from "lucide-react";
import { useStaffContext, useManagerContext } from "../../hook/useContext";
import { useNavigate } from "react-router-dom";

const RoomForm = () => {
  const [roomForm, setRoomForm] = useState({
    image: null,
    roomNumber: "",
    category: "", // pastikan untuk mengisi ini dengan ID tipe kamar yang sesuai
  });
  const [categories, setCategories] = useState([]);
  const { addRoom } = useStaffContext();
  const { getTipeKost } = useManagerContext();
  const navigate = useNavigate();

  // Handler untuk input teks dan select
  const handleChange = (e) => {
    const { id, value } = e.target;
    setRoomForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handler untuk upload gambar
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRoomForm((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await addRoom(roomForm);
    navigate(-1);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getTipeKost();
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, [getTipeKost]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Upload size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Tambah Kamar Baru
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Lengkapi detail informasi unit kamar baru
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          {/* Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Foto Kamar
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer group relative w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-blue-400 transition-all overflow-hidden bg-gray-50"
              >
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  hidden
                  onChange={handleImageChange}
                />
                {roomForm.image ? (
                  <img
                    src={URL.createObjectURL(roomForm.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity"
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                    alt="uploadArea"
                  />
                )}
              </label>
              {roomForm.image && (
                <div className="text-xs text-gray-500 font-medium">
                  <p className="text-blue-600 font-bold">Gambar terpilih:</p>
                  <p>{roomForm.image.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Grid Nomor & Tipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* No Kamar */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="roomNumber"
              >
                Nomor Kamar
              </label>
              <input
                id="roomNumber"
                type="text"
                placeholder="Contoh: B-102"
                value={roomForm.roomNumber}
                onChange={handleChange}
                className="w-full outline-none py-3 px-5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700"
                required
              />
            </div>

            {/* Tipe Kamar */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="category"
              >
                Tipe Kamar
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={roomForm.category}
                  onChange={handleChange}
                  className="w-full outline-none py-3 px-5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all appearance-none font-medium text-gray-700 bg-transparent"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Harga
          <div className="md:w-1/2 flex flex-col gap-2">
            <label
              className="text-sm font-bold text-gray-700 uppercase tracking-wider"
              htmlFor="price"
            >
              Harga Sewa / Bulan
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                Rp
              </span>
              <input
                id="price"
                type="number"
                placeholder="0"
                value={roomForm.price}
                onChange={handleChange}
                className="w-full outline-none py-3 pl-14 pr-5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-blue-600 text-lg"
                required
              />
            </div>
          </div> */}
        </div>

        {/* Footer Action */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <Save size={18} />
            Simpan Data Kamar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
