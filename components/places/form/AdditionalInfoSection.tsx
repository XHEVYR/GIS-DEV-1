import { PlaceDetail } from "@/types";
import { Info, Tag, Clock, Phone, Globe, CheckSquare } from "lucide-react";

interface AdditionalInfoSectionProps {
  category: string;
  detail: PlaceDetail;
  onChange: (field: keyof PlaceDetail, value: string) => void;
}

export default function AdditionalInfoSection({
  category,
  detail,
  onChange,
}: AdditionalInfoSectionProps) {
  const getLabels = () => {
    switch (category.toLowerCase()) {
      case "hotel":
        return {
          accessInfo: "Waktu Check-in/Check-out",
          priceInfo: "Range Harga per Malam",
          facilities: "Fasilitas Kamar/Hotel",
          contactInfo: "Telepon Reservasi",
        };
      case "cafe":
        return {
          accessInfo: "Jam Buka - Tutup",
          priceInfo: "Range Harga Menu",
          facilities: "Fasilitas (WiFi/AC/Outdoor)",
          contactInfo: "Kontak / Whatsapp",
        };
      case "wisata":
        return {
          accessInfo: "Jam Operasional",
          priceInfo: "Harga Tiket Masuk",
          facilities: "Fasilitas Umum",
          contactInfo: "Kontak Informasi",
        };
      default:
        return {
          accessInfo: "Info Akses / Jam Buka",
          priceInfo: "Info Harga",
          facilities: "Fasilitas Tersedia",
          contactInfo: "Kontak",
        };
    }
  };

  const labels = getLabels();

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
      <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold border-b pb-2">
        <Info size={18} />
        <h3>Detail Tambahan ({category || "Umum"})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Access Info (Jam Buka / Check-in) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Clock size={12} /> {labels.accessInfo}
          </label>
          <input
            type="text"
            value={detail.accessInfo || ""}
            onChange={(e) => onChange("accessInfo", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder={`Contoh: 08.00 - 22.00`}
          />
        </div>

        {/* Price Info */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Tag size={12} /> {labels.priceInfo}
          </label>
          <input
            type="text"
            value={detail.priceInfo || ""}
            onChange={(e) => onChange("priceInfo", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder="Contoh: Rp 20.000 - Rp 50.000"
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Phone size={12} /> {labels.contactInfo}
          </label>
          <input
            type="text"
            value={detail.contactInfo || ""}
            onChange={(e) => onChange("contactInfo", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder="Contoh: 0812-3456-7890"
          />
        </div>

        {/* Website / Social Media */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Globe size={12} /> Website / Social Media
          </label>
          <input
            type="text"
            value={detail.webUrl || ""}
            onChange={(e) => onChange("webUrl", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder="Contoh: https://instagram.com/..."
          />
        </div>
      </div>

      {/* Facilities (Full Width) */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          <CheckSquare size={12} /> {labels.facilities}
        </label>
        <textarea
          rows={2}
          value={detail.facilities || ""}
          onChange={(e) => onChange("facilities", e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm resize-none"
          placeholder="Tulis fasilitas yang tersedia, pisahkan dengan koma..."
        />
      </div>
    </div>
  );
}
