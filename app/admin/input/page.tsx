"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// Kita import komponen Master yang sudah dibuat di langkah 1
import PlaceForm from "@/components/places/PlaceForm";

export default function InputPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  // --- LOGIC: KHUSUS UNTUK TAMBAH DATA (POST) ---
  const handleSave = async (data: any) => {
    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan data baru.");
    }

    // Jika sukses, tampilkan notif & redirect
    setSuccess(true);
    setTimeout(() => router.push("/admin/data"), 1500);
  };

  // Tampilan Sukses (Opsional)
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-100 shadow-2xl rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Berhasil!</h2>
          <p className="text-slate-500 mb-8">Data lokasi baru telah ditambahkan.</p>
          <button disabled className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl opacity-80 cursor-not-allowed">
            Mengalihkan...
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  // Kita panggil PlaceForm TANPA props "initialData".
  // Komponen PlaceForm akan otomatis tahu ini adalah Mode Tambah.
  return (
    <PlaceForm
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}