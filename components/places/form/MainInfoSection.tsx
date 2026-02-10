import { AlignLeft, Maximize2 } from "lucide-react";
import { Place } from "@/types";

interface MainInfoSectionProps {
  formData: Place;
  handleChange: (field: keyof Place, value: string) => void;
}

const STYLES = {
  input:
    "w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 transition-all outline-none placeholder:text-slate-400 hover:border-slate-300",
  label:
    "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide ml-1",
  sectionTitle:
    "text-xl font-black text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b-2 border-slate-100",
};

export default function MainInfoSection({
  formData,
  handleChange,
}: MainInfoSectionProps) {
  return (
    <div>
      <h3 className={STYLES.sectionTitle}>
        <span className="p-2 bg-lime-100 text-lime-600 rounded-lg">
          <AlignLeft size={20} />
        </span>
        Informasi Utama
      </h3>

      <div className="space-y-8">
        <div>
          <label className={STYLES.label}>Nama Tempat</label>
          <input
            className={STYLES.input}
            placeholder="Masukkan Nama Tempat"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
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
                onChange={(e) => handleChange("category", e.target.value)}
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
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              required
              placeholder="Jalan, Kelurahan"
            />
          </div>
        </div>

        <div>
          <label className={STYLES.label}>Deskripsi Lengkap</label>
          <textarea
            className={`${STYLES.input} min-h-37.5 resize-none leading-relaxed`}
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Masukkan Deskripsi Tempat"
          />
        </div>
      </div>
    </div>
  );
}
