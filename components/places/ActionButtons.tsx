"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ActionButtonsProps {
  name: string;           
  onEdit: () => void;     
  onDelete: () => void;   
}

export default function ActionButtons({ name, onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      
      {/* 1. TOMBOL EDIT (Langsung eksekusi fungsi onEdit) */}
      <button 
        onClick={onEdit}
        className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100"
        title="Edit Data"
      >
        <Edit size={16} />
      </button>

      {/* 2. TOMBOL DELETE (Dibungkus Alert Dialog) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100"
            title="Hapus Data"
          >
            <Trash2 size={16} />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus &quot;{name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Data akan hilang permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}