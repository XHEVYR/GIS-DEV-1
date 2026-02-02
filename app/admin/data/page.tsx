"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SearchBar from "@/components/searchbar"; 
import { 
  MapPin, 
  Image as ImageIcon, 
  Save, 
  XCircle, 
  Info, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';

// Import Dynamic Map untuk Edit Mode
const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-100 flex items-center justify-center rounded-2xl animate-pulse">
      <span className="text-slate-400 font-medium">Memuat Peta...</span>
    </div>
  )
});

// Interface Data
interface Place {
  id: string;
  name: string;
  category: string;
  lat: number | string;
  lon: number | string;
  address?: string;
  image?: string;
  description?: string;
}

export default function Dashboard() {
  // STATE 1: Data Master (Database Asli)
  const [places, setPlaces] = useState<Place[]>([]);
  
  // STATE 2: Data Tampilan (Hasil Search) <--- 2. State untuk Filter
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data Awal
  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [];
        setPlaces(result);        
        setFilteredPlaces(result); // <--- Isi kedua state saat pertama load
      });
  }, []);

  // --- 3. FUNGSI SEARCH ---
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPlaces(places); // Reset ke data master jika kosong
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = places.filter((place) => 
      place.name.toLowerCase().includes(lowerQuery) || 
      place.address?.toLowerCase().includes(lowerQuery) ||
      place.category.toLowerCase().includes(lowerQuery)
    );

    setFilteredPlaces(results);
  };

  // --- HANDLERS LAINNYA ---

  const handleEditClick = (place: Place) => {
    setEditId(place.id);
    setError(null);
    // Konversi Lat/Lon ke String agar mudah diedit
    setEditForm({ 
      ...place, 
      lat: place.lat.toString(),
      lon: place.lon.toString(),
      address: place.address || "",
      image: place.image || "",
      description: place.description || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMapSelect = (lat: number, lon: number) => {
    if (editForm) {
      setEditForm({ ...editForm, lat: lat.toString(), lon: lon.toString() });
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'lat' | 'lon') => {
    const value = e.target.value;
    if (/^-?[\d.]*$/.test(value) && editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setLoading(true);
    
    if(!editForm.lat || !editForm.lon) {
       setError("Koordinat tidak boleh kosong.");
       setLoading(false);
       return;
    }

    const payload = {
      ...editForm,
      lat: parseFloat(editForm.lat.toString()),
      lon: parseFloat(editForm.lon.toString())
    };

    try {
      const res = await fetch(`/api/places/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        // Update di Master & Filtered agar tampilan sinkron
        const updateStates = (prev: Place[]) => 
            prev.map(p => p.id === editForm.id ? { ...payload, id: editForm.id } : p);

        setPlaces(updateStates); 
        setFilteredPlaces(updateStates); // <--- Update juga yang ditampilkan

        setEditId(null);
        setEditForm(null);
      } else {
        throw new Error("Gagal menyimpan perubahan");
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus "${name}"?`)) {
      try {
        await fetch(`/api/places/${id}`, { method: 'DELETE' });
        
        // Hapus dari Master & Filtered
        const deleteStates = (prev: Place[]) => prev.filter(p => p.id !== id);
        
        setPlaces(deleteStates);
        setFilteredPlaces(deleteStates); // <--- Hapus juga dari tampilan

      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm(null);
    setError(null);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-800 transition-all outline-none text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500";

  // --- RENDER MODE EDIT (FORM LENGKAP) ---
  if (editId && editForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header Edit */}
          <header className="border-b border-slate-200 pb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Edit <span className="text-indigo-600">Lokasi</span>
              </h1>
              <p className="mt-2 text-slate-500">Perbarui informasi dan titik koordinat.</p>
            </div>
            <button onClick={handleCancel} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition text-slate-600">
               <XCircle size={24} />
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAP SECTION (Kiri) */}
            <section className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="rounded-3xl shadow-sm border border-white bg-white p-2 overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-3 bg-indigo-600 rounded-t-2xl text-white">
                  <MapPin size={20} />
                  <h2 className="font-bold tracking-wide">Update Posisi</h2>
                </div>
                <div className="h-[450px] w-full relative rounded-b-2xl overflow-hidden border-x border-b border-slate-50">
                  <MapInput 
                    onLocationSelect={handleMapSelect}
                    inputLat={parseFloat(editForm.lat.toString())}
                    inputLon={parseFloat(editForm.lon.toString())}
                  />
                </div>
                <div className="p-4 flex gap-2 items-start bg-indigo-50/50">
                  <Info size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-indigo-800 font-semibold leading-relaxed">
                    Geser marker atau ketik koordinat manual untuk mengubah lokasi.
                  </p>
                </div>
              </div>
            </section>

            {/* FORM SECTION (Kanan) */}
            <form onSubmit={handleSaveEdit} className="lg:col-span-7 space-y-6">
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              <div className="rounded-3xl p-8 shadow-sm border border-white bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="md:col-span-2">
                    <label className={labelClass}>Nama Tempat</label>
                    <input 
                      className={inputClass} 
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      required 
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      className={`${inputClass} font-mono`}
                      value={editForm.lat} 
                      onChange={(e) => handleCoordinateChange(e, 'lat')}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      className={`${inputClass} font-mono`}
                      value={editForm.lon} 
                      onChange={(e) => handleCoordinateChange(e, 'lon')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Kategori Lokasi</label>
                    <select 
                      className={inputClass} 
                      value={editForm.category}
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      required
                    >
                      <option value="hotel">🏨 Hotel & Penginapan</option>
                      <option value="cafe">☕ Cafe & Resto</option>
                      <option value="wisata">✈️ Destinasi Wisata</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>URL Gambar</label>
                    <div className="relative group">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                      <input 
                        className={`${inputClass} pl-12`} 
                        value={editForm.image}
                        onChange={e => setEditForm({...editForm, image: e.target.value})}
                      />
                    </div>
                  </div>

                  {editForm.image && (
                    <div className="md:col-span-2 border-2 border-slate-50 rounded-2xl overflow-hidden">
                      <img src={editForm.image} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-44 object-cover" 
                        onError={(e) => e.currentTarget.src = "https://via.placeholder.com/600x300?text=Error"} 
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelClass}>Alamat Lengkap</label>
                    <textarea 
                      className={`${inputClass} min-h-[80px]`} 
                      value={editForm.address}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Deskripsi</label>
                    <textarea 
                      className={`${inputClass} min-h-[100px]`} 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-6 border-t border-slate-100">
                  <button type="button" onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                    <XCircle size={20} /> Batal
                  </button>
                  <button disabled={loading} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : <><Save size={20} /> Simpan Perubahan</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MODE TABEL (DEFAULT) ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DENGAN SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Data <span className="text-indigo-600"> Lokasi</span></h1>
            <p className="text-slate-500 mt-1">Kelola data lokasi GIS Anda.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* 4. TEMPAT SEARCH BAR */}
            <div className="w-full sm:w-64">
                <SearchBar onSearch={handleSearch} placeholder="Cari nama / alamat..." />
            </div>

            <Link href="/admin/input" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition whitespace-nowrap">
              <Plus size={20} /> Tambah
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Tempat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Kategori</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Koordinat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* 5. LOOPING MENGGUNAKAN FILTERED PLACES */}
                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => (
                    <tr key={place.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-5 font-bold text-slate-700">
                        {place.name}
                        {place.image && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">IMG</span>}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                          place.category === 'wisata' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          place.category === 'hotel' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          place.category === 'cafe' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-slate-50 text-slate-700 border-slate-100'
                        }`}>
                          {place.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 text-xs font-mono">
                        {Number(place.lat).toFixed(5)}, <br/> {Number(place.lon).toFixed(5)}
                      </td>
                      <td className="p-5 text-slate-500 text-sm truncate max-w-[200px]">
                        {place.address || "-"}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(place)}
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(place.id, place.name)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // PESAN JIKA HASIL SEARCH KOSONG
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                       <div className="flex flex-col items-center gap-2">
                          <Info size={24} className="text-slate-300"/>
                          <span>Data tidak ditemukan.</span>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}