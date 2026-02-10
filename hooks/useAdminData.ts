import { useState, useEffect, useCallback, useRef } from "react";
import { Place } from "@/types";

export function useAdminData() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Place;
    direction: "asc" | "desc";
  } | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: "", message: "" });

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

  // Initial fetch & Polling
  useEffect(() => {
    fetchPlaces();
    const intervalId = setInterval(fetchPlaces, 15000);
    return () => clearInterval(intervalId);
  }, [fetchPlaces]);

  // Filtering & Sorting
  useEffect(() => {
    let result = [...places];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.address?.toLowerCase().includes(lowerQuery) ||
          p.category.includes(lowerQuery),
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
  }, [places, searchQuery, sortConfig]);

  // Pagination Logic
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

  const showNotification = useCallback((title: string, message: string) => {
    setNotification({ show: true, title, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

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
    notification,

    // Actions
    setItemsPerPage,
    setEditingPlace,
    handlePageChange,
    handleSearch,
    handleSort,
    handleSave,
    handleDelete,
    showNotification,
  };
}
