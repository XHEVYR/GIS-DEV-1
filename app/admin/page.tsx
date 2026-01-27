"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  image?: string;
  description?: string;
}

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  // BUKA POPUP EDIT
  const handleEditClick = (place: Place) => {
    setEditId(place.id);
    setEditForm({ ...place });
  };

  // SIMPAN PERUBAHAN EDIT
  const handleSaveEdit = async () => {
    if (!editForm) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/places/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setPlaces(places.map(p => p.id === editForm.id ? editForm : p));
        setEditId(null);
        setEditForm(null);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // HAPUS DATA
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus "${name}"?`)) {
      try {
        await fetch(`/api/places/${id}`, { method: 'DELETE' });
        setPlaces(places.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Lokasi</h1>
        <Link href="/admin/input" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow transition">
          + Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama Tempat</th>
              <th className="p-4 font-semibold text-gray-600">Kategori</th>
              <th className="p-4 font-semibold text-gray-600">Koordinat</th>
              <th className="p-4 font-semibold text-gray-600">Alamat</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">
                  {place.name}
                  {place.image && <span className="ml-2 text-xs text-green-600 font-bold">📷</span>}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 uppercase">
                    {place.category}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm font-mono">
                  {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
                </td>
                <td className="p-4 text-gray-500 text-sm truncate max-w-xs">
                  {place.address || "-"}
                </td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => handleEditClick(place)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold transition">
                    ✎ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(place.id, place.name)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold transition">
                    🗑 Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {places.length === 0 && <p className="p-8 text-center text-gray-500">Belum ada data.</p>}
      </div>

      {/* POPUP EDIT */}
      {editId && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Lokasi</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tempat</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select 
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full border p-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="hotel">Hotel</option>
                  <option value="cafe">Cafe / Resto</option>
                  <option value="wisata">Tempat Wisata</option>
                  <option value="kampus">Kampus / Sekolah</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input 
                    type="number"
                    step="any"
                    value={editForm.lat}
                    onChange={(e) => setEditForm({...editForm, lat: parseFloat(e.target.value)})}
                    className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input 
                    type="number"
                    step="any"
                    value={editForm.lon}
                    onChange={(e) => setEditForm({...editForm, lon: parseFloat(e.target.value)})}
                    className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea 
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full border p-2 rounded h-16 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full border p-2 rounded h-16 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
                <input 
                  type="text"
                  value={editForm.image || ""}
                  onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                
                {/* PREVIEW GAMBAR */}
                {editForm.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={editForm.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=URL+Tidak+Valid";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold transition disabled:opacity-50">
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button 
                onClick={() => setEditId(null)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white p-2 rounded font-bold transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}