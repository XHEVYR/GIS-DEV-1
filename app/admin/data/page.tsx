"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Database, Search, Settings2 } from "lucide-react";
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

// --- STYLES ---
const STYLES = {
  headerIcon: "bg-black text-lime-400 p-2.5 rounded-xl shadow-xl shadow-slate-900/10",
  pageTitle: "text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3",
  subTitle: "hidden md:block mt-1 text-sm text-slate-500 font-medium ml-1",
  
  // Tombol aksi tetap solid
  actionButton: "flex items-center justify-center gap-2 bg-lime-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-lime-700 shadow-lg shadow-lime-800/30 transition-all active:scale-95",
  
  // Container Pagination (diberi padding agar tidak mepet pinggir layar)
  paginationWrapper: "mt-4 flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-6 md:px-12",
  paginationCanvas: "bg-white text-slate-700 border border-slate-200 rounded-2xl px-2 py-2 w-fit shadow-sm",
};

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        const result = Array.isArray(data) ? data : [];
        setPlaces(result);
        setFilteredPlaces(result);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1); 
    if (!query) {
      setFilteredPlaces(places);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = places.filter((p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.address?.toLowerCase().includes(lowerQuery) ||
        p.category.includes(lowerQuery)
    );
    setFilteredPlaces(results);
  };

  const handleSave = async (updatedData: Place) => {
    try {
      const res = await fetch(`/api/places/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedData, lat: parseFloat(updatedData.lat.toString()), lon: parseFloat(updatedData.lon.toString()) }),
      });
      if (!res.ok) throw new Error("Gagal update database");
      const newPlaces = places.map((p) => p.id === updatedData.id ? updatedData : p);
      setPlaces(newPlaces);
      setFilteredPlaces(newPlaces);
      setEditingPlace(null);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      const remaining = places.filter((p) => p.id !== id);
      setPlaces(remaining);
      setFilteredPlaces(remaining);
      const newTotalPages = Math.ceil(remaining.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  if (editingPlace) {
    return (
      <div className="w-full transition-all duration-500">
        <PlaceForm initialData={editingPlace} onSave={handleSave} onCancel={() => setEditingPlace(null)} />
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    // HAPUS padding horizontal (px-0) agar full width
    <div className="w-full transition-all duration-500 ease-in-out">
      
      {/* HEADER: Tetap ada padding agar konten header tidak mepet layar */}
      <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 py-5 px-6 md:px-12 transition-all">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className={STYLES.pageTitle}>
              <span className={STYLES.headerIcon}><Database size={22} /></span>
              Data <span className="text-lime-600">Lokasi</span>
            </h1>
            <p className={STYLES.subTitle}>Kelola total {filteredPlaces.length} data geospasial Kota Blitar.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 min-w-50 lg:w-72">
              <SearchBar onSearch={handleSearch} placeholder="Cari nama atau kategori..." />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-lime-300 transition-colors">
              <Settings2 size={14} className="text-slate-400" />
              <select 
                className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer hover:text-black transition-colors"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={10}>10 Baris</option>
                <option value={25}>25 Baris</option>
                <option value={50}>50 Baris</option>
                <option value={100}>100 Baris</option>
              </select>
            </div>
            <Link href="/admin/input" className={STYLES.actionButton}>
              <Plus size={20} strokeWidth={3} /> <span className="hidden sm:inline">Tambah</span>
            </Link>
          </div>
        </div>
      </header>

      {/* TABEL DATA */}
      <div className="w-full overflow-hidden border-t border-b border-slate-200 bg-white">
        <PlaceTable
          data={currentPlaces} 
          onEdit={(place) => setEditingPlace(place)}
          onDelete={handleDelete}
        />
      </div>

      {/* PAGINATION */}
      <div className={STYLES.paginationWrapper}>
        <div className="text-center md:text-left pl-2">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredPlaces.length)} dari {filteredPlaces.length} Lokasi
          </p>
        </div>

        {filteredPlaces.length > 0 && totalPages > 1 && (
          <div className={STYLES.paginationCanvas}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }} className={`hover:bg-lime-50 hover:text-lime-700 transition-colors ${currentPage === 1 ? "opacity-30 pointer-events-none" : ""}`} />
                </PaginationItem>
                {generatePagination(currentPage, totalPages).map((page, index) => {
                  if (page === "...") return <PaginationItem key={`dots-${index}`}><PaginationEllipsis className="text-slate-300" /></PaginationItem>;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }} className={`rounded-xl border-none font-bold transition-all ${currentPage === page ? "bg-lime-600 text-white shadow-lg shadow-lime-200/50 scale-105" : "text-slate-500 hover:bg-lime-50 hover:text-lime-700"}`}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }} className={`hover:bg-lime-50 hover:text-lime-700 transition-colors ${currentPage === totalPages ? "opacity-30 pointer-events-none" : ""}`} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}