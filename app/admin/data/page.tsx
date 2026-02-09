"use client";

import { useEffect, useState, useCallback, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

// --- STYLES ---
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

// --- CONTENT COMPONENT ---
function DataPageContent() {
  const searchParams = useSearchParams();
  // 1. Ambil query dari URL (misal: ?q=hotel -> "hotel")
  const initialQuery = searchParams.get("q") || "";

  const [places, setPlaces] = useState<Place[]>([]);
  
  // 2. State pencarian diinisialisasi dengan query URL
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Place;
    direction: "asc" | "desc";
  } | null>(null);

  const isEditingRef = useRef(false);
  isEditingRef.current = !!editingPlace;

  // --- WAJIB DITAMBAHKAN: SINKRONISASI URL ---
  // Jika URL berubah (misal user klik Back atau klik menu Data Lokasi untuk reset),
  // update state searchQuery agar tabel kembali menampilkan semua data.
  useEffect(() => {
    setSearchQuery(initialQuery);
    setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
  }, [initialQuery]);

  const fetchPlaces = useCallback(async () => {
    if (isEditingRef.current) return;
    try {
      const res = await fetch("/api/places");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Auto-refresh error:", error);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
    const intervalId = setInterval(fetchPlaces, 15000);
    return () => clearInterval(intervalId);
  }, [fetchPlaces]);

  // --- LOGIC FILTER & SORT ---
  const processedPlaces = useMemo(() => {
    let result = [...places];

    // Filter berdasarkan searchQuery
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.address?.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [places, searchQuery, sortConfig]);

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlaces = processedPlaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedPlaces.length / itemsPerPage);

  // Reset page jika hasil filter membuat page saat ini kosong
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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

  const handleSort = (key: keyof Place) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
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
      if (!res.ok) throw new Error("Gagal update");
      setPlaces((prev) => prev.map((p) => (p.id === updatedData.id ? updatedData : p)));
      setEditingPlace(null);
      fetchPlaces();
    } catch (error) {
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus data?")) return;
    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      setPlaces((prev) => prev.filter((p) => p.id !== id));
      fetchPlaces();
    } catch (err) {
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

  return (
    <div className="w-full transition-all duration-500 ease-in-out">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 py-5 px-6 md:px-12 transition-all">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className={STYLES.pageTitle}>
              <span className={STYLES.headerIcon}>
                <Database size={22} />
              </span>
              Data <span className="text-lime-600">Lokasi</span>
            </h1>
            <p className={STYLES.subTitle}>
              Kelola total {processedPlaces.length} data geospasial Kota Blitar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 min-w-50 lg:w-72">
              <SearchBar
                onSearch={handleSearch}
                defaultValue={searchQuery} // Ini membuat kotak input terisi otomatis
                placeholder="Cari nama atau kategori..."
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-lime-300 transition-colors">
              <Settings2 size={14} className="text-slate-400" />
              <select
                className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={10}>10 Baris</option>
                <option value={25}>25 Baris</option>
                <option value={50}>50 Baris</option>
              </select>
            </div>
            <Link href="/admin/input" className={STYLES.actionButton}>
              <Plus size={20} strokeWidth={3} /> <span className="hidden sm:inline">Tambah</span>
            </Link>
          </div>
        </div>
      </header>

      {/* TABLE */}
      <div className="w-full overflow-hidden border-t border-b border-slate-200 bg-white">
        <PlaceTable
          data={currentPlaces}
          onEdit={setEditingPlace}
          onDelete={handleDelete}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      {/* PAGINATION */}
      <div className={STYLES.paginationWrapper}>
        <div className="text-center md:text-left pl-2">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            Menampilkan {processedPlaces.length === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, processedPlaces.length)} dari {processedPlaces.length} Lokasi
          </p>
        </div>
        {processedPlaces.length > 0 && totalPages > 1 && (
          <div className={STYLES.paginationCanvas}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "opacity-30 pointer-events-none" : ""} />
                </PaginationItem>
                {generatePagination(currentPage, totalPages).map((page, i) => 
                  page === "..." ? (
                    <PaginationItem key={`dots-${i}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}>{page}</PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? "opacity-30 pointer-events-none" : ""} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE (SUSPENSE WRAPPER) ---
export default function DataPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      </div>
    }>
      <DataPageContent />
    </Suspense>
  );
}