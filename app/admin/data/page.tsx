"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Database, 
  Search,
  Settings2
} from "lucide-react";

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

// --- STYLE CONSTANTS ---
const STYLES = {
  headerIcon: "bg-indigo-600 text-white p-1.5 rounded-lg shadow-indigo-200 shadow-lg",
  pageTitle: "text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2",
  subTitle: "hidden md:block mt-1 text-sm text-slate-500 font-medium ml-1",
  actionButton: "flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95",
  paginationWrapper: "mt-8 flex flex-col md:flex-row justify-between items-center gap-4 pb-10",
  paginationCanvas: "bg-white text-slate-700 border border-slate-200 rounded-2xl px-2 py-2 w-fit shadow-sm",
  selectInput: "bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer hover:border-slate-300",
};

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  
  // State Pagination
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

  // Logika Pagination
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      
      const remaining = places.filter((p) => p.id !== id);
      setPlaces(remaining);
      setFilteredPlaces(remaining);

      const newTotalPages = Math.ceil(remaining.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
         setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  if (editingPlace) {
    return (
      <div className="w-full transition-all duration-500">
        <PlaceForm
          initialData={editingPlace}
          onSave={handleSave}
          onCancel={() => setEditingPlace(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 transition-all duration-500 ease-in-out">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 mb-8 py-4 transition-all rounded-xl mt-2">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-1">
          <div>
            <h1 className={STYLES.pageTitle}>
              <span className={STYLES.headerIcon}>
                <Database size={20} />
              </span>
              Data <span className="text-indigo-600">Lokasi</span>
            </h1>
            <p className={STYLES.subTitle}>
              Kelola total {filteredPlaces.length} data geospasial Kota Blitar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 min-w-[200px] lg:w-72">
              <SearchBar onSearch={handleSearch} placeholder="Cari nama atau kategori..." />
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              <Settings2 size={14} className="text-slate-400" />
              <select 
                className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-md">
        <PlaceTable
          data={currentPlaces} 
          onEdit={(place) => setEditingPlace(place)}
          onDelete={handleDelete}
        />
      </div>

      {/* PAGINATION */}
      <div className={STYLES.paginationWrapper}>
        <div className="text-center md:text-left pl-2">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredPlaces.length)} dari {filteredPlaces.length} Lokasi
          </p>
        </div>

        {filteredPlaces.length > 0 && totalPages > 1 && (
          <div className={STYLES.paginationCanvas}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "opacity-30 pointer-events-none" : ""}
                  />
                </PaginationItem>

                {generatePagination(currentPage, totalPages).map((page, index) => {
                  if (page === "...") {
                    return <PaginationItem key={`dots-${index}`}><PaginationEllipsis className="text-slate-300" /></PaginationItem>;
                  }
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}
                        className={`rounded-xl border-none font-bold ${
                          currentPage === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "opacity-30 pointer-events-none" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}