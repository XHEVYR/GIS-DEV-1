"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
// Import komponen form sakti yang sudah kita buat
import PlaceForm from "@/components/places/PlaceForm"; 

export default function InputPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  // Function ini akan dipanggil ketika tombol "Simpan" di PlaceForm diklik
  const handleSave = async (data: any) => {
    // Data yang dikirim dari PlaceForm sudah rapi (termasuk array images)
    // Kita tinggal kirim ke API POST
    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal menyimpan data ke server.");
    }

    // Jika sukses, aktifkan mode sukses
    setSuccess(true);
    setTimeout(() => router.push("/admin/data"), 1500);
  };

  // --- TAMPILAN SUKSES (ANIMASI) ---
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

  // --- RENDER UTAMA ---
  return (
    <div className="w-full transition-all duration-500">
      {/* Panggil PlaceForm TANPA props `initialData`.
         Otomatis PlaceForm akan tahu ini adalah mode "TAMBAH DATA".
         Fitur 5 gambar, peta, dan validasi sudah otomatis ikut.
      */}
      <PlaceForm 
        onSave={handleSave} 
        onCancel={() => router.back()} 
      />
    </div>
  );
}