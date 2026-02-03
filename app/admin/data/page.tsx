"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import SearchBar from "@/components/ui/searchbar";
import PlaceTable from "@/components/places/PlaceTable"; // Double slash diperbaiki
import PlaceForm from "@/components/places/PlaceForm";
import { Place } from "@/types";

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

  // State untuk Edit Mode
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Fetch Data
  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        const result = Array.isArray(data) ? data : [];
        setPlaces(result);
        setFilteredPlaces(result);
      });
  }, []);

  // Logic Search
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPlaces(places);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = places.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.address?.toLowerCase().includes(lowerQuery) ||
        p.category.includes(lowerQuery)
    );
    setFilteredPlaces(results);
  };

  // Logic Save Edit
  const handleSave = async (updatedData: Place) => {
    try {
      const res = await fetch(`/api/places/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedData,
          lat: parseFloat(updatedData.lat.toString()),
          lon: parseFloat(updatedData.lon.toString()),
        }),
      });

      if (!res.ok) throw new Error("Gagal update database");
      
      const newPlaces = places.map((p) =>
        p.id === updatedData.id ? updatedData : p
      );
      setPlaces(newPlaces);
      setFilteredPlaces(newPlaces);
      setEditingPlace(null);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  //  LOGIC DELETE 
  const handleDelete = async (id: string, ) => {
    

    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      
      if (!res.ok) throw new Error("Gagal menghapus data");
      
      // Update State (Hapus data dari tampilan tanpa reload)
      const remaining = places.filter((p) => p.id !== id);
      setPlaces(remaining);
      setFilteredPlaces(remaining);
      
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data dari server.");
    }
  };
  // ---------------------------------------

  // Tampilan FORM Edit
  if (editingPlace) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <PlaceForm
          initialData={editingPlace}
          onSave={handleSave}
          onCancel={() => setEditingPlace(null)}
        />
      </div>
    );
  }

  // Tampilan TABEL Utama
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Data <span className="text-indigo-600">Lokasi</span>
            </h1>
            <p className="text-slate-500 mt-1">Kelola data lokasi GIS Anda.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <SearchBar onSearch={handleSearch} placeholder="Cari lokasi..." />
            </div>
            <Link
              href="/admin/input"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg transition"
            >
              <Plus size={20} /> Tambah
            </Link>
          </div>
        </div>

        {/* Tabel Data */}
        <PlaceTable
          data={filteredPlaces}
          onEdit={(place) => setEditingPlace(place)}
          onDelete={handleDelete}
        />
        
      </div>
    </div>
  );
}