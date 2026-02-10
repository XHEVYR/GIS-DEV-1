import Image from "next/image";
import { Image as ImageIcon, Trash2, Plus } from "lucide-react";

interface ImageSectionProps {
  images: string[];
  onImageChange: (index: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const STYLES = {
  input:
    "w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 transition-all outline-none placeholder:text-slate-400 hover:border-slate-300",
  label:
    "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide ml-1",
  sectionTitle:
    "text-xl font-black text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b-2 border-slate-100",
};

export default function ImageSection({
  images,
  onImageChange,
  onAddImage,
  onRemoveImage,
}: ImageSectionProps) {
  return (
    <div>
      <h3 className={STYLES.sectionTitle}>
        <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
          <ImageIcon size={20} />
        </span>
        Visualisasi
      </h3>

      <div className="space-y-8">
        {images.map((url: string, index: number) => (
          <div
            key={index}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 group"
          >
            <label className={STYLES.label}>
              {index === 0 ? "Foto Utama (Cover)" : `Foto Galeri ${index}`}
            </label>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  className={`${STYLES.input} pl-12`}
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => onImageChange(index, e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ImageIcon size={18} />
                </div>
              </div>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
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
                <button
                  type="button"
                  onClick={() => {
                    if (images.length > 1) {
                      onRemoveImage(index);
                    } else {
                      onImageChange(index, "");
                    }
                  }}
                  className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all scale-90 hover:scale-100 shadow-lg z-10"
                  title="Hapus gambar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={onAddImage}
            className="w-full py-5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:border-lime-500 hover:text-lime-600 hover:bg-lime-50 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={20} /> Tambah Slot Foto
          </button>
        )}
      </div>
    </div>
  );
}
