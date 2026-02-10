import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// --- DYNAMIC MAP ---
const MapInput = dynamic(() => import("@/components/maps/mapinput"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-125 bg-slate-100 flex flex-col items-center justify-center rounded-[32px] animate-pulse gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-lime-500 rounded-full animate-spin"></div>
      <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
        Memuat Peta...
      </span>
    </div>
  ),
});

interface MapSectionProps {
  lat: string;
  lon: string;
  onLocationSelect: (lat: number, lon: number) => void;
  onLatChange: (val: string) => void;
  onLonChange: (val: string) => void;
}

export default function MapSection({
  lat,
  lon,
  onLocationSelect,
  onLatChange,
  onLonChange,
}: MapSectionProps) {
  return (
    <section className="xl:col-span-5 flex flex-col gap-6 xl:sticky xl:top-8 transition-all xl:pr-10 xl:border-r border-slate-200 min-h-[calc(100vh-200px)]">
      <div className="relative w-full aspect-4/5 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 border border-slate-200">
        <MapInput
          onLocationSelect={onLocationSelect}
          inputLat={lat ? parseFloat(lat) : undefined}
          inputLon={lon ? parseFloat(lon) : undefined}
        />
      </div>

      {/* Koordinat Inputs (Moved below map) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 shadow-sm">
        <div className="flex-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
            Latitude
          </label>
          <div className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/20 transition-all">
            <input
              type="number"
              step="any"
              className="w-full bg-transparent font-mono font-bold text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
              placeholder="-8.xxxxx"
              value={lat}
              onChange={(e) => onLatChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
            Longitude
          </label>
          <div className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/20 transition-all">
            <input
              type="number"
              step="any"
              className="w-full bg-transparent font-mono font-bold text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
              placeholder="112.xxxxx"
              value={lon}
              onChange={(e) => onLonChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
        <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          Geser pin pada peta untuk mendapatkan titik koordinat yang akurat,
          atau masukkan angka manual jika Anda memilikinya.
        </p>
      </div>
    </section>
  );
}
