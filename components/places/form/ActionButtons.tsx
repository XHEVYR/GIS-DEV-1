import { Save } from "lucide-react";

interface ActionButtonsProps {
  isEditMode: boolean;
  loading: boolean;
  isLoadingParent?: boolean;
  onCancel: () => void;
}

export default function ActionButtons({
  isEditMode,   
  loading,
  isLoadingParent = false,
  onCancel,
}: ActionButtonsProps) {
  return (
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
    </div>
  );
}
