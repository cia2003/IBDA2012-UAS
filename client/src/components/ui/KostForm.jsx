import { useState, useEffect } from "react";
import { Upload, Save, Edit3, ArrowLeft } from "lucide-react";
import { useManagerContext } from "../../hook/useContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const KostForm = () => {
  const { addKost, editKost, getKostById } = useManagerContext();
  const navigate = useNavigate();
  const { kostId } = useParams();
  const isEditMode = Boolean(kostId);

  const [kostForm, setKostForm] = useState({
    img: null,
    name: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchOldData = async () => {
        const oldData = await getKostById(kostId);
        if (oldData) {
          setKostForm({
            name: oldData.name || "",
            address: oldData.address || "",
            description: oldData.description || "",
            img: oldData.img || null,
          });
        }
      };
      fetchOldData();
    }
  }, [kostId, isEditMode, getKostById]);

  const handleChange = (e) => {
    const { kostId, value } = e.target;
    const fieldMap = {
      "name-kost": "name",
      "address-kost": "address",
      "description-kost": "description",
    };

    setKostForm((prev) => ({
      ...prev,
      [fieldMap[kostId]]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setKostForm((prev) => ({
        ...prev,
        img: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // --- LOGIKA EDIT ---
        await editKost(kostId, kostForm);
        navigate("/dashboard/manager");
      } else {
        // --- LOGIKA TAMBAH ---
        await addKost(kostForm);
        navigate("/dashboard/manager");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${isEditMode ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}
          >
            {isEditMode ? <Edit3 size={24} /> : <Upload size={24} />}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">
              {isEditMode ? "Edit Data Kost" : "Tambah Kost Baru"}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              {isEditMode
                ? `Mengubah data kost ID: ${kostId}`
                : "Lengkapi detail informasi kost baru Anda"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          {/* Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Foto Kost
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="image-input" className="cursor-pointer group">
                <input
                  accept="image/*"
                  type="file"
                  kostId="image-input"
                  hidden
                  onChange={handleImageChange}
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-blue-400 transition-all overflow-hidden">
                  {kostForm.img ? (
                    <img
                      src={
                        typeof kostForm.img === "string"
                          ? kostForm.img
                          : URL.createObjectURL(kostForm.img)
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      className="w-10 h-10 opacity-50"
                      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                      alt="uploadArea"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="name-kost"
              >
                Nama Kost
              </label>
              <input
                kostId="name-kost"
                type="text"
                placeholder="Masukan nama kost..."
                className="input-style"
                required
                value={kostForm.name}
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="address-kost"
              >
                Alamat
              </label>
              <input
                kostId="address-kost"
                placeholder="Masukan alamat lengkap..."
                type="text"
                className="input-style"
                required
                value={kostForm.address}
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-gray-700 uppercase tracking-wider"
              htmlFor="description-kost"
            >
              Deskripsi
            </label>
            <textarea
              kostId="description-kost"
              placeholder="Deskripsi fasilitas, peraturan, dll..."
              rows={4}
              value={kostForm.description}
              onChange={handleChange}
              className="input-style resize-none"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <Save size={18} />
            {isEditMode ? "Perbaharui Data Kost" : "Simpan Data Kost"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KostForm;
