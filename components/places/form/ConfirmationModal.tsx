import { Save } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-lime-50">
          <Save size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          Konfirmasi Simpan
        </h3>
        <p className="text-slate-500 mb-8 font-medium">
          Pastikan data lokasi yang Anda masukkan sudah benar.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Cek Lagi
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-3 rounded-xl bg-lime-500 text-slate-900 font-bold hover:bg-lime-400 transition-colors shadow-lg shadow-lime-200"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
