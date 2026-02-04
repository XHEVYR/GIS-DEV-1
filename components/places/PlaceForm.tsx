"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  XCircle,
  PlusCircle,
  Edit,
  AlignLeft,
  CheckCircle2, // Tambahkan ini
} from "lucide-react";
import FormActions from "@/components/places/FormActions";

// --- SETUP MAP ---
const MapInput = dynamic(() => import("@/components/maps/mapinput"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[400px] bg-slate-100 flex items-center justify-center rounded-2xl animate-pulse">
      <span className="text-slate-400 font-medium">Memuat Peta...</span>
    </div>
  ),
});

// --- STYLES ---
const STYLES = {
  input: "w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none hover:border-slate-300 shadow-sm",
  label: "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500",
  card: "bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300",
  headerTitle: "font-bold text-lg text-slate-800 flex items-center gap-3 mb-6 pb-4 border-b border-slate-50",
  iconBox: (color: string) => `p-2 rounded-lg ${color}`,
};

// --- PROPS ---
interface PlaceFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoadingParent?: boolean;
}

export default function PlaceForm({ initialData, onSave, onCancel, isLoadingParent = false }: PlaceFormProps) {
  const isEditMode = !!initialData;

  // --- STATE (Single Image) ---
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    lat: initialData?.lat?.toString() || "",
    lon: initialData?.lon?.toString() || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    image: initialData?.image || "", // Pastikan ini String Tunggal
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // --- HANDLERS ---
  const handleMapClick = (lat: number, lon: number) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lon: lon.toString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.lat || !formData.lon) {
      setError("Lokasi belum dipilih! Silakan klik peta atau isi koordinat.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeSave = async () => {
    setLoading(true);
    setIsConfirmOpen(false);
    try {
      await onSave({
        ...formData,
        // Pastikan dikirim sebagai image (tunggal) bukan images (array)
        image: formData.image, 
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        // Sertakan ID jika Edit Mode
        id: initialData?.id, 
      });
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
      setLoading(false);
    }
  };

  const pageTitle = isEditMode ? "Edit Lokasi" : "Tambah Lokasi";
  const pageSubtitle = isEditMode 
    ? "Perbarui informasi data geospasial." 
    : "Input data geospasial baru ke dalam sistem.";
  
  const PageIcon = isEditMode ? Edit : PlusCircle;
  const iconColorClass = isEditMode 
    ? "bg-amber-500 text-white shadow-amber-200" 
    : "bg-indigo-600 text-white shadow-indigo-200";

  return (
    <div className="w-full max-w-full transition-all duration-500 ease-in-out">
      <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 mb-8 py-4 transition-all rounded-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className={`p-1.5 rounded-lg shadow-lg ${iconColorClass}`}>
                <PageIcon size={20} />
              </span>
              {pageTitle}
            </h1>
            <p className="hidden md:block mt-1 text-sm text-slate-500 font-medium ml-1">
              {pageSubtitle}
            </p>
          </div>
          <button 
            onClick={onCancel} 
            className="group flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <XCircle size={22} className="group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline-block ml-2 font-bold text-sm">Batal</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            <section className="xl:col-span-5 flex flex-col gap-6 xl:sticky xl:top-28 transition-all duration-300">
              <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/40 transition-all">
                <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-50">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <MapPin size={18} className="text-indigo-600" />
                    <h3 className="font-bold text-sm tracking-wide uppercase">Lokasi Titik</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Klik Peta</span>
                </div>
                <div className="relative w-full aspect-square xl:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                  <MapInput
                    onLocationSelect={handleMapClick}
                    inputLat={formData.lat ? parseFloat(formData.lat) : undefined}
                    inputLon={formData.lon ? parseFloat(formData.lon) : undefined}
                  />
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50/50">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">LATITUDE</label>
                    <input type="number" step="any" className="w-full text-xs font-mono font-bold text-slate-700 outline-none bg-transparent" value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} placeholder="-8.xxxx" />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">LONGITUDE</label>
                    <input type="number" step="any" className="w-full text-xs font-mono font-bold text-slate-700 outline-none bg-transparent" value={formData.lon} onChange={(e) => setFormData({...formData, lon: e.target.value})} placeholder="112.xxxx" />
                  </div>
                </div>
              </div>
            </section>

            <section className="xl:col-span-7 flex flex-col gap-6">
              <div className={STYLES.card}>
                <div className={STYLES.headerTitle}>
                  <div className={STYLES.iconBox("bg-indigo-50 text-indigo-600")}><AlignLeft size={20} /></div>
                  Informasi Umum
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={STYLES.label}>Nama Tempat</label>
                    <input className={STYLES.input} placeholder="Masukkan nama tempat..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className={STYLES.label}>Kategori</label>
                    <div className="relative">
                      <select className={`${STYLES.input} appearance-none cursor-pointer`} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="">Pilih Kategori...</option>
                        <option value="hotel">🏨 Hotel & Penginapan</option>
                        <option value="cafe">☕ Cafe & Resto</option>
                        <option value="wisata">✈️ Destinasi Wisata</option>
                      </select>
                    </div>
                  </div>
                  <div>
                      <label className={STYLES.label}>Alamat Singkat</label>
                      <textarea className={`${STYLES.input} min-h-[52px] resize-none pt-3`} rows={1} placeholder="Jl. Raya..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={STYLES.label}>Deskripsi</label>
                    <textarea className={`${STYLES.input} min-h-[100px]`} placeholder="Jelaskan detail tentang tempat ini..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Card 2: Visualisasi (Single Image) */}
              <div className={STYLES.card}>
                <div className={STYLES.headerTitle}>
                  <div className={STYLES.iconBox("bg-purple-50 text-purple-600")}><ImageIcon size={20} /></div>
                  Visualisasi
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={STYLES.label}>URL Gambar</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input className={`${STYLES.input} pl-12`} placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-inner">
                      <Image src={formData.image} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" onError={() => setFormData({ ...formData, image: "" })} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-400" /> Gambar Valid
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-4 z-20 xl:static">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200 xl:border-none xl:shadow-none xl:bg-transparent xl:p-0">
                  <FormActions 
                    loading={loading || isLoadingParent} 
                    onCancel={onCancel} 
                    isAlertOpen={isConfirmOpen} 
                    setIsAlertOpen={setIsConfirmOpen} 
                    onConfirmSave={executeSave} 
                    saveLabel={isEditMode ? "Simpan Perubahan" : "Simpan Data Baru"} 
                  />
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}