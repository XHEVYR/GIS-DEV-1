"use client";

import { Save, XCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (v: boolean) => void;
  onConfirmSave: () => void;
  saveLabel?: string; // <--- INI PERBAIKANNYA (Menambahkan prop optional)
}

export default function FormActions({
  loading,
  onCancel,
  isAlertOpen,
  setIsAlertOpen,
  onConfirmSave,
  saveLabel = "Simpan Perubahan", // Default value jika tidak diisi
}: FormActionsProps) {
  return (
    <>
      {/* CONTAINER TOMBOL
        Saya ubah style-nya agar cocok dengan 'Sticky Bottom' di halaman Edit yang baru.
        Tidak lagi pakai 'md:col-span-2' karena akan merusak grid layout baru.
      */}
      <div className="flex items-center gap-3 w-full">
        {/* Tombol Batal */}
        <button
          type="button"
          onClick={onCancel}
          className="hidden md:flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
        >
          <XCircle size={20} />
          Batal
        </button>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>{saveLabel}</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Dialog (Logic Lama Tetap Dipakai) */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white rounded-3xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-900">
              Simpan Perubahan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Pastikan data yang Anda masukkan sudah benar. Data yang lama akan ditimpa dengan data baru ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 py-5">
              Periksa Lagi
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold py-5 px-6"
            >
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}