"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", 
    lat: "", 
    lon: "", 
    category: "", 
    description: "",
    address: "",  // <-- Tambah state
    image: ""     // <-- Tambah state
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setLoading(false);
    router.push('/admin'); 
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-black">Input Lokasi Lengkap</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAMA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tempat</label>
          <input className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black" 
            onChange={e => setForm({...form, name: e.target.value})} required />
        </div>

        {/* KOORDINAT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Latitude</label>
            <input type="number" step="any" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black mb-1" 
              placeholder="-7.xxxxx"
              onChange={e => setForm({...form, lat: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="any" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black mb-1" 
              placeholder="112.xxxxx"
              onChange={e => setForm({...form, lon: e.target.value})} required />
          </div>
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select className="w-full border p-2 rounded bg-white text-black mb-1" 
            onChange={e => setForm({...form, category: e.target.value})}>
            <option value="hotel">Hotel</option>
            <option value="cafe">Cafe / Resto</option>
            <option value="wisata">Tempat Wisata</option>
            <option value="kampus">Kampus / Sekolah</option>
          </select>
        </div>

        {/* GAMBAR (URL) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
          <input className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black mb-1" 
            placeholder="https://..."
            onChange={e => setForm({...form, image: e.target.value})} />
            <p className="text-xs text-gray-400 mt-1">*Copy link gambar dari Google dulu</p>
        </div>

        {/* ALAMAT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
          <textarea className="w-full border p-2 rounded h-20 text-black mb-1" 
            onChange={e => setForm({...form, address: e.target.value})} />
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea className="w-full border p-2 rounded h-24 text-black mb-1" 
            onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
          {loading ? "Menyimpan..." : "SIMPAN DATA"}
        </button>
      </form>
    </div>
  );
}