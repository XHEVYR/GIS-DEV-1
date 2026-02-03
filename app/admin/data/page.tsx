"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react"; // Chevron tidak perlu lagi karena sudah ada di Pagination component

// 1. IMPORT UI SHADCN
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import SearchBar from "@/components/ui/searchbar";
import PlaceTable from "@/components/places/PlaceTable";
import PlaceForm from "@/components/places/PlaceForm";
import { Place } from "@/types";
import { generatePagination } from "@/lib/utils";

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);

  // Fungsi Pindah Halaman
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Logic Search
  const handleSearch = (query: string) => {
    // Reset halaman ke 1 setiap kali search berubah
    setCurrentPage(1); 

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

  // LOGIC DELETE 
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      
      if (!res.ok) throw new Error("Gagal menghapus data");
      
      // Update State
      const remaining = places.filter((p) => p.id !== id);
      setPlaces(remaining);
      setFilteredPlaces(remaining);

      // Cek jika halaman saat ini jadi kosong setelah hapus, mundur 1 halaman
      const newTotalPages = Math.ceil(remaining.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
         setCurrentPage(newTotalPages);
      }
      
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data dari server.");
    }
  };

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
          data={currentPlaces} 
          onEdit={(place) => setEditingPlace(place)}
          onDelete={handleDelete}
        />

        {/* 2. PAGINATION SHADCN UI (Light Mode & Right Aligned) */}
        {filteredPlaces.length > 0 && totalPages > 1 && (
          // UBAH DISINI: 'justify-end' untuk memindahkan ke kanan
          <div className="mt-8 flex justify-end">
            
            {/* UBAH DISINI: Style Light Mode (bg-white, border, text-dark) */}
            <div className="bg-white text-slate-700 border border-slate-200 rounded-xl px-2 py-2 w-fit shadow-sm">
              <Pagination>
                <PaginationContent>
                  
                  {/* Tombol Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      // UBAH Hover Style
                      className={`hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                        currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                      }`}
                    />
                  </PaginationItem>

                  {/* Loop Nomor Halaman dari helper function */}
                  {generatePagination(currentPage, totalPages).map((page, index) => {
                    // Jika output adalah titik-titik (...)
                    if (page === "...") {
                      return (
                        <PaginationItem key={`dots-${index}`}>
                          <PaginationEllipsis className="text-slate-400" />
                        </PaginationItem>
                      );
                    }

                    // Jika output adalah nomor halaman
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page as number);
                          }}
                          // UBAH Style Active & Hover Light Mode
                          className={`hover:bg-slate-100 hover:text-slate-900 transition-colors border-none ${
                            currentPage === page
                              ? "bg-slate-200 text-slate-900 font-bold" // Style Halaman Aktif (Abu terang)
                              : "text-slate-600" // Style Halaman Biasa (Abu gelap)
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Tombol Next */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      // UBAH Hover Style
                      className={`hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                        currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                      }`}
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}