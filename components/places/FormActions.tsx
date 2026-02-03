"use client";

import { Save, XCircle } from "lucide-react";
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
  loading: boolean;           // Status loading
  onCancel: () => void;       // Fungsi tombol Batal
  isAlertOpen: boolean;       // Status Alert terbuka/tutup
  setIsAlertOpen: (v: boolean) => void;
  onConfirmSave: () => void;  // Fungsi eksekusi simpan
}

export default function FormActions({
  loading,
  onCancel,
  isAlertOpen,
  setIsAlertOpen,
  onConfirmSave,
}: FormActionsProps) {
  return (
    <>
      {/* Tombol Batal & Simpan */}
      <div className="md:col-span-2 pt-6 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
        >
          <XCircle size={20} /> Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-2 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            "Menyimpan..."
          ) : (
            <>
              <Save size={20} /> Simpan Perubahan
            </>
          )}
        </button>
      </div>

      {/* Alert Dialog (Pop-Up Konfirmasi Edit) */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Simpan Perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan data yang Anda masukkan sudah benar. Data yang lama akan ditimpa dengan data baru ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Periksa Lagi</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}