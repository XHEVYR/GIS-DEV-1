"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Import komponen form sakti yang sudah kita buat
import PlaceForm from "@/components/places/PlaceForm";

import { Place } from "@/types";

export default function InputPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  // Function ini akan dipanggil ketika tombol "Simpan" di pencet
  const handleSave = async (data: Place) => {
    // Kirim ke API POST
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
    setTimeout(() => router.push("/admin/data?success=true"), 1500);
  };

  // TAMPILAN SUKSES 
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
        
        {/* Card Minimal */}
        <div className="relative max-w-sm w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-10 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
          
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Berhasil!
          </h2>
          <p className="text-slate-500 mb-8">
            Data lokasi baru telah tersimpan.
          </p>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
            <span className="text-sm font-medium">Mengalihkan...</span>
          </div>

        </div>
      </div>
    );
  }

  // RENDER UTAMA
  return (
    <div className="w-full transition-all duration-500">
      <PlaceForm onSave={handleSave} onCancel={() => router.back()} />
    </div>
  );
}
