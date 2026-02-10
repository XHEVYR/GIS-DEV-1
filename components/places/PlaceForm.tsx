"use client";

import { AlertCircle, X } from "lucide-react";
import { Place } from "@/types";
import { usePlaceForm } from "@/hooks/usePlaceForm";
import MapSection from "@/components/places/form/MapSection";
import MainInfoSection from "@/components/places/form/MainInfoSection";
import AdditionalInfoSection from "@/components/places/form/AdditionalInfoSection";
import ImageSection from "@/components/places/form/ImageSection";
import ActionButtons from "@/components/places/form/ActionButtons";
import ConfirmationModal from "@/components/places/form/ConfirmationModal";

interface PlaceFormProps {
  initialData?: Place;
  onSave: (data: Place) => Promise<void>;
  onCancel: () => void;
  isLoadingParent?: boolean;
}

export default function PlaceForm({
  initialData,
  onSave,
  onCancel,
  isLoadingParent = false,
}: PlaceFormProps) {
  const isEditMode = !!initialData;

  const {
    formData,
    loading,
    error,
    isConfirmOpen,
    setIsConfirmOpen,
    handleChange,
    handleDetailChange,
    handleMapClick,
    handleImageChange,
    addImageField,
    removeImageField,
    handleSubmit,
    executeSave,
  } = usePlaceForm({ initialData, onSave });

  return (
    <div className="w-full pb-32">
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isEditMode ? "Edit Lokasi" : "Input Lokasi Baru"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Lengkapi detail informasi geospasial di bawah ini.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-r-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 items-start">
          {/* --- KOLOM KIRI: PETA --- */}
          <MapSection
            lat={formData.lat?.toString() || ""}
            lon={formData.lon?.toString() || ""}
            onLocationSelect={handleMapClick}
            onLatChange={(val) => handleChange("lat", val)}
            onLonChange={(val) => handleChange("lon", val)}
          />

          {/* --- KOLOM KANAN: FORM INPUT --- */}
          <section className="xl:col-span-7 flex flex-col gap-10 xl:pl-10 pt-10 xl:pt-0">
            {/* BAGIAN 1: DETAIL UTAMA */}
            <MainInfoSection formData={formData} handleChange={handleChange} />

            {/* GARIS PEMISAH ANTAR SEKSI (DASHED) */}
            <div className="border-t-2 border-dashed border-slate-200 my-2"></div>

            {/* DETAIL TAMBAHAN (Sesuai Kategori) */}
            {formData.detail && (
              <AdditionalInfoSection
                category={formData.category || ""}
                detail={formData.detail}
                onChange={handleDetailChange}
              />
            )}

            <div className="border-t-2 border-dashed border-slate-200 my-2"></div>

            {/* BAGIAN 2: VISUALISASI */}
            <ImageSection
              images={formData.images || []}
              onImageChange={handleImageChange}
              onAddImage={addImageField}
              onRemoveImage={removeImageField}
            />

            {/* ACTION BAR (Floating) */}
            <ActionButtons
              isEditMode={isEditMode}
              loading={loading}
              isLoadingParent={isLoadingParent}
              onCancel={onCancel}
            />

            {/* Konfirmasi Alert */}
            <ConfirmationModal
              isOpen={isConfirmOpen}
              onConfirm={executeSave}
              onCancel={() => setIsConfirmOpen(false)}
            />
          </section>
        </div>
      </form>
    </div>
  );
}
