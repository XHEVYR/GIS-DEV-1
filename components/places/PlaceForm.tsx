"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Image as ImageIcon,
  AlertCircle,
  X,
  Plus,
  MapPin,
  Save,
  Trash2,
  Maximize2,
  AlignLeft
} from "lucide-react";
import FormActions from "@/components/places/FormActions";

// --- DYNAMIC MAP ---
const MapInput = dynamic(() => import("@/components/maps/mapinput"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[500px] bg-slate-100 flex flex-col items-center justify-center rounded-[32px] animate-pulse gap-3">
       <div className="w-10 h-10 border-4 border-slate-200 border-t-lime-500 rounded-full animate-spin"></div>
       <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Peta...</span>
    </div>
  ),
});

// --- STYLES DIPERTEGAS ---
const STYLES = {
  // Input: Border diperjelas (border-slate-200) agar kotak terlihat nyata
  input:
    "w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 transition-all outline-none placeholder:text-slate-400 hover:border-slate-300",
  
  label: "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide ml-1",
  
  // Judul Seksi dengan Garis Bawah Tebal
  sectionTitle: "text-xl font-black text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b-2 border-slate-100",
};

interface PlaceFormProps {
  initialData?: any; 
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoadingParent?: boolean;
}

export default function PlaceForm({
  initialData,
  onSave,
  onCancel,
  isLoadingParent = false,
}: PlaceFormProps) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    lat: initialData?.lat?.toString() || "",
    lon: initialData?.lon?.toString() || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    images:
      initialData?.placeImages && initialData.placeImages.length > 0
        ? initialData.placeImages.map((img: any) => img.url)
        : [""], 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleMapClick = (lat: number, lon: number) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lon: lon.toString(),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ""] });
    }
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.lat || !formData.lon) {
      setError("Lokasi belum dipilih! Silakan klik peta atau isi koordinat.");
      return;
    }
    if (formData.images.filter((img: string) => img.trim() !== "").length === 0) {
      setError("Minimal sertakan 1 Link Gambar.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeSave = async () => {
    setLoading(true);
    setIsConfirmOpen(false);
    const cleanImages = formData.images.filter((img: string) => img.trim() !== "");

    try {
      await onSave({
        ...formData,
        images: cleanImages,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        id: initialData?.id,
      });
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full pb-32">
      
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isEditMode ? "Edit Lokasi" : "Input Lokasi Baru"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Lengkapi detail informasi geospasial di bawah ini.
          </p>
        </div>
        
        <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-100 hover:text-red-600 transition-all font-bold text-sm shadow-sm"
          >
            <X size={18} />
            Batal
        </button>
      </header>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-r-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 items-start">
          
          {/* --- KOLOM KIRI: PETA --- */}
          {/* Tambahkan padding kanan (pr-10) dan border kanan (border-r) */}
          <section className="xl:col-span-5 flex flex-col gap-6 xl:sticky xl:top-8 transition-all xl:pr-10 xl:border-r border-slate-200 min-h-[calc(100vh-200px)]">
            <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 border border-slate-200">
              <MapInput
                onLocationSelect={handleMapClick}
                inputLat={formData.lat ? parseFloat(formData.lat) : undefined}
                inputLon={formData.lon ? parseFloat(formData.lon) : undefined}
              />
              
              {/* Koordinat Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 flex gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Latitude</label>
                    <div className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        <p className="font-mono font-bold text-slate-800 text-sm truncate">{formData.lat || "-"}</p>
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Longitude</label>
                    <div className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        <p className="font-mono font-bold text-slate-800 text-sm truncate">{formData.lon || "-"}</p>
                    </div>
                 </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
               <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
               <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Geser pin pada peta untuk mendapatkan titik koordinat yang akurat, atau masukkan angka manual jika Anda memilikinya.
               </p>
            </div>
          </section>

          {/* --- KOLOM KANAN: FORM INPUT --- */}
          {/* Tambahkan padding kiri (pl-10) */}
          <section className="xl:col-span-7 flex flex-col gap-10 xl:pl-10 pt-10 xl:pt-0">
            
            {/* BAGIAN 1: DETAIL UTAMA */}
            <div>
              <h3 className={STYLES.sectionTitle}>
                 <span className="p-2 bg-lime-100 text-lime-600 rounded-lg"><AlignLeft size={20}/></span>
                 Informasi Utama
              </h3>
              
              <div className="space-y-8">
                 <div>
                    <label className={STYLES.label}>Nama Tempat</label>
                    <input
                      className={STYLES.input}
                      placeholder="Contoh: Hotel Tugu Blitar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className={STYLES.label}>Kategori</label>
                        <div className="relative">
                            <select
                                className={`${STYLES.input} appearance-none cursor-pointer`}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="hotel">🏨 Hotel & Penginapan</option>
                                <option value="cafe">☕ Cafe & Resto</option>
                                <option value="wisata">✈️ Destinasi Wisata</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Maximize2 size={16} className="rotate-45" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Alamat Singkat</label>
                        <input
                            className={STYLES.input}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            placeholder="Jalan, Kelurahan"
                        />
                    </div>
                 </div>

                 <div>
                    <label className={STYLES.label}>Deskripsi Lengkap</label>
                    <textarea
                      className={`${STYLES.input} min-h-[150px] resize-none leading-relaxed`}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ceritakan tentang fasilitas, sejarah, atau daya tarik tempat ini..."
                    />
                 </div>
              </div>
            </div>

            {/* GARIS PEMISAH ANTAR SEKSI (DASHED) */}
            <div className="border-t-2 border-dashed border-slate-200 my-2"></div>

            {/* BAGIAN 2: VISUALISASI */}
            <div>
              <h3 className={STYLES.sectionTitle}>
                 <span className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ImageIcon size={20}/></span>
                 Visualisasi
              </h3>

              <div className="space-y-8">
                 {formData.images.map((url: string, index: number) => (
                    <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500 group">
                       <label className={STYLES.label}>
                          {index === 0 ? "Foto Utama (Cover)" : `Foto Galeri ${index}`}
                       </label>
                       
                       <div className="flex gap-3">
                          <div className="flex-1 relative">
                             <input
                                className={`${STYLES.input} pl-12`}
                                placeholder="https://..."
                                value={url}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                             />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <ImageIcon size={18} />
                             </div>
                          </div>
                          {formData.images.length > 1 && (
                             <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="px-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                             >
                                <Trash2 size={20} />
                             </button>
                          )}
                       </div>

                       {/* Preview Image dengan Border Jelas */}
                       {url && (
                          <div className="mt-4 relative h-48 w-full rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-200 group-hover:border-lime-400 transition-colors">
                             <Image
                                src={url}
                                alt="Preview"
                                fill
                                className="object-cover"
                                onError={() => {}} 
                             />
                          </div>
                       )}
                    </div>
                 ))}

                 {formData.images.length < 5 && (
                    <button
                      type="button"
                      onClick={addImageField}
                      className="w-full py-5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:border-lime-500 hover:text-lime-600 hover:bg-lime-50 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <Plus size={20} /> Tambah Slot Foto
                    </button>
                 )}
              </div>
            </div>

            {/* ACTION BAR (Floating) */}
            <div className="sticky bottom-6 z-20">
               <div className="bg-slate-900 p-2 pl-6 pr-2 rounded-full shadow-2xl flex items-center justify-between border border-slate-700">
                  <span className="text-slate-300 text-sm font-bold hidden sm:block">
                     {isEditMode ? "Simpan perubahan data?" : "Simpan lokasi baru?"}
                  </span>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                     <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-full text-slate-400 font-bold text-sm hover:text-white hover:bg-white/10 transition-colors"
                     >
                        Batal
                     </button>
                     <button
                        type="submit"
                        disabled={loading || isLoadingParent}
                        className="flex-1 sm:flex-none px-8 py-3 bg-lime-500 hover:bg-lime-400 text-slate-900 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(132,204,22,0.4)]"
                     >
                        {loading ? (
                           <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                        ) : (
                           <>
                              <Save size={18} /> Simpan
                           </>
                        )}
                     </button>
                  </div>
               </div>
               
               {/* Konfirmasi Alert */}
               {isConfirmOpen && (
                  <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                     <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-lime-50">
                           <Save size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Konfirmasi Simpan</h3>
                        <p className="text-slate-500 mb-8 font-medium">Pastikan data lokasi yang Anda masukkan sudah benar.</p>
                        <div className="grid grid-cols-2 gap-3">
                           <button
                              type="button"
                              onClick={() => setIsConfirmOpen(false)}
                              className="py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
                           >
                              Cek Lagi
                           </button>
                           <button
                              type="button"
                              onClick={executeSave}
                              className="py-3 rounded-xl bg-lime-500 text-slate-900 font-bold hover:bg-lime-400 transition-colors shadow-lg shadow-lime-200"
                           >
                              Ya, Simpan
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>

          </section>
        </div>
      </form>
    </div>
  );
}