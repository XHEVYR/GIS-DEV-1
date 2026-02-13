import { useState, useEffect, useCallback, useRef } from "react";
import { Place } from "@/types";

// Custom hook untuk mengelola data admin (list, filter, sort, pagination)
export function useAdminData() {
  // State Utama
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Place;
    direction: "asc" | "desc";
  } | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: "", message: "" });

  // Ref: Untuk melacak apakah sedang dalam mode edit
  const isEditingRef = useRef(false);
  isEditingRef.current = !!editingPlace;

  // Fungsi: Mengambil data tempat dari API
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

  // Effect: Fetch awal & auto-refresh (polling)
  useEffect(() => {
    fetchPlaces();
    const intervalId = setInterval(fetchPlaces, 15000);
    return () => clearInterval(intervalId);
  }, [fetchPlaces]);

  // Effect: Filter & Sort data berdasarkan input user
  useEffect(() => {
    let result = [...places];

    if (categoryFilter !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.address?.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery),
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPlaces(result);
  }, [places, searchQuery, sortConfig, categoryFilter]);

  // Logika Pagination
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);

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

  // Fungsi Notifikasi (Toast)
  const showNotification = useCallback((title: string, message: string) => {
    setNotification({ show: true, title, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  // Handler: Update Data (PUT)
  const handleSave = async (updatedData: Place) => {
    try {
      if (!updatedData.id) throw new Error("ID tidak ditemukan");

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

      setPlaces((prev) =>
        prev.map((p) => (p.id === updatedData.id ? updatedData : p)),
      );
      setEditingPlace(null);
      fetchPlaces();
      showNotification(
        "Berhasil Diperbarui",
        "Perubahan data lokasi telah disimpan.",
      );
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  // Handler: Hapus Data (DELETE)
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");

      setPlaces((prev) => prev.filter((p) => p.id !== id));
      fetchPlaces();
      showNotification(
        "Berhasil Dihapus",
        "Data lokasi telah dihapus dari sistem.",
      );
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  // Handler: Sorting kolom tabel
  const handleSort = (key: keyof Place) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  // Handler: Pencarian (Search)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    // Data
    places,
    filteredPlaces,
    currentPlaces,
    totalPages,
    currentPage,
    itemsPerPage,
    editingPlace,
    sortConfig,
    searchQuery,
    categoryFilter,
    notification,

    // Actions
    setItemsPerPage,
    setEditingPlace,
    setCategoryFilter,
    handlePageChange,
    handleSearch,
    handleSort,
    handleSave,
    handleDelete,
    showNotification,
  };
}
