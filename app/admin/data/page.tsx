"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react"; // Tambah useMemo
import Link from "next/link";
import { Plus, Database, Settings2 } from "lucide-react";
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

// ... (STYLES tetap sama) ...
const STYLES = {
  headerIcon:
    "bg-black text-lime-400 p-2.5 rounded-xl shadow-xl shadow-slate-900/10",
  pageTitle:
    "text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3",
  subTitle: "hidden md:block mt-1 text-sm text-slate-500 font-medium ml-1",
  actionButton:
    "flex items-center justify-center gap-2 bg-lime-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-lime-700 shadow-lg shadow-lime-800/30 transition-all active:scale-95",
  paginationWrapper:
    "mt-4 flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-6 md:px-12",
  paginationCanvas:
    "bg-white text-slate-700 border border-slate-200 rounded-2xl px-2 py-2 w-fit shadow-sm",
};

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  // Kita hapus state 'filteredPlaces' manual, kita ganti dengan useMemo di bawah
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. STATE UNTUK SORTING
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Place;
    direction: "asc" | "desc";
  } | null>(null);

  const isEditingRef = useRef(false);
  isEditingRef.current = !!editingPlace;

  const fetchPlaces = useCallback(async () => {
    if (isEditingRef.current) return;
    try {
      const res = await fetch("/api/places");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const result = Array.isArray(data) ? data : [];
      setPlaces(result);
    } catch (error) {
      console.error("Auto-refresh error:", error);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
    const intervalId = setInterval(fetchPlaces, 15000);
    return () => clearInterval(intervalId);
  }, [fetchPlaces]);

  // 2. LOGIC FILTER & SORTING (GABUNGAN)
  const processedPlaces = useMemo(() => {
    let data = [...places];

    // A. Filtering
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.address?.toLowerCase().includes(lowerQuery) ||
          p.category.includes(lowerQuery),
      );
    }

    // B. Sorting
    if (sortConfig !== null) {
      data.sort((a, b) => {
        // Ambil value, handle jika null/undefined
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [places, searchQuery, sortConfig]);

  // 3. HANDLER SAAT HEADER DIKLIK
  const handleSort = (key: keyof Place) => {
    let direction: "asc" | "desc" = "asc";

    // Jika diklik kolom yang sama, balik arahnya (toggle)
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 4. Update Pagination Logic (Gunakan processedPlaces)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlaces = processedPlaces.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(processedPlaces.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSave = async (updatedData: Place) => {
    // ... (Logic simpan tetap sama) ...
    // Code disingkat untuk keterbacaan, copy logic handleSave lama Anda kesini
    try {
      // Fetch simulasi
      setEditingPlace(null);
      fetchPlaces();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id: string) => {
    // ... (Logic delete tetap sama) ...
    fetchPlaces();
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
    <div className="w-full transition-all duration-500 ease-in-out">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 py-5 px-6 md:px-12 transition-all">
        {/* ... (Header content tetap sama) ... */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className={STYLES.pageTitle}>
              <span className={STYLES.headerIcon}>
                <Database size={22} />
              </span>
              Data <span className="text-lime-600">Lokasi</span>
            </h1>
            <p className={STYLES.subTitle}>
              Kelola total {processedPlaces.length} data geospasial kawasan
              Blitar.
            </p>
          </div>
          {/* ... Sisa header search bar dll ... */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 min-w-50 lg:w-72">
              <SearchBar onSearch={handleSearch} placeholder="Cari..." />
            </div>
            {/* ... Tombol settings & tambah ... */}
          </div>
        </div>
      </header>

      {/* 5. TABEL DATA (PASS PROPS SORTING) */}
      <div className="w-full overflow-hidden border-t border-b border-slate-200 bg-white">
        <PlaceTable
          data={currentPlaces}
          onEdit={(place) => setEditingPlace(place)}
          onDelete={handleDelete}
          onSort={handleSort} // Prop Baru
          sortConfig={sortConfig} // Prop Baru
        />
      </div>

      {/* PAGINATION */}
      <div className={STYLES.paginationWrapper}>
        <div className="text-center md:text-left pl-2">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            Menampilkan{" "}
            {processedPlaces.length === 0 ? 0 : indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, processedPlaces.length)} dari{" "}
            {processedPlaces.length} Lokasi
          </p>
        </div>

        {processedPlaces.length > 0 && totalPages > 1 && (
          <div className={STYLES.paginationCanvas}>
            {/* ... Component Pagination Tetap Sama ... */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {/* Logic Pagination loop */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
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
