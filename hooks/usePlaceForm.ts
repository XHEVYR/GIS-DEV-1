import { useState, useEffect } from "react";
import { Place } from "@/types";

interface UsePlaceFormProps {
  initialData?: Place;
  onSave: (data: Place) => Promise<void>;
}

export function usePlaceForm({ initialData, onSave }: UsePlaceFormProps) {
  const [formData, setFormData] = useState<Place>({
    name: initialData?.name || "",
    lat: initialData?.lat?.toString() || "",
    lon: initialData?.lon?.toString() || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    // Pastikan images/placeImages terhandle dengan baik
    images:
      initialData?.placeImages && initialData.placeImages.length > 0
        ? initialData.placeImages.map((img) => img.url)
        : [""],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (field: keyof Place, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (lat: number, lon: number) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lon: lon.toString(),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if ((formData.images || []).length < 5) {
      setFormData({ ...formData, images: [...(formData.images || []), ""] });
    }
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter(
      (_: string, i: number) => i !== index,
    );
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.lat || !formData.lon) {
      setError("Lokasi belum dipilih! Silakan klik peta atau isi koordinat.");
      return;
    }
    if (
      (formData.images || []).filter((img: string) => img.trim() !== "")
        .length === 0
    ) {
      setError("Minimal sertakan 1 Link Gambar.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeSave = async () => {
    setLoading(true);
    setIsConfirmOpen(false);
    const cleanImages = (formData.images || []).filter(
      (img: string) => img.trim() !== "",
    );

    try {
      await onSave({
        ...formData,
        images: cleanImages,
        lat: parseFloat(formData.lat.toString()),
        lon: parseFloat(formData.lon.toString()),
        id: initialData?.id,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyimpan data.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    isConfirmOpen,
    setIsConfirmOpen,
    handleChange,
    handleMapClick,
    handleImageChange,
    addImageField,
    removeImageField,
    handleSubmit,
    executeSave,
  };
}
