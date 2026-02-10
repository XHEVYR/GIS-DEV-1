"use client";

import dynamic from "next/dynamic";
import { Maximize2, Minimize2 } from "lucide-react";

// --- MAP COMPONENT (DYNAMIC IMPORT) ---
const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 rounded-[32px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      <p className="text-sm font-semibold animate-pulse">Memuat Peta...</p>
    </div>
  ),
});

interface HeroSectionProps {
  isFullScreen: boolean;
  onOpenMap: () => void;
  onCloseMap: () => void;
}

export default function HeroSection({
  isFullScreen,
  onOpenMap,
  onCloseMap,
}: HeroSectionProps) {
  return (
    <section className="relative px-6 py-12 lg:py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
      {/* Text Content */}
      <div className="space-y-8 order-2 lg:order-1 animate-in slide-in-from-left duration-700 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-lime-200 text-lime-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          GIS App
        </div>

        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Satu Peta <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600 decoration-4 underline decoration-lime-200 underline-offset-4">
            Terintegrasi.
          </span>
        </h1>

        <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
          Eksplorasi potensi <strong>Kota & Kabupaten Blitar</strong>. Temukan
          lokasi Hotel, Kafe, dan Wisata dengan data yang akurat dan real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={onOpenMap}
            className="flex items-center justify-center gap-3 px-8 py-4 text-white bg-slate-900 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200 group"
          >
            <Maximize2
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
            Mulai Jelajah
          </button>
        </div>
      </div>

      {/* MAP WIDGET */}
      <div
        className={`
          ${
            isFullScreen
              ? "fixed inset-0 z-[9999] h-screen w-screen bg-slate-100"
              : "relative group order-1 lg:order-2 h-[450px] lg:h-[600px] w-full"
          }
        `}
      >
        {!isFullScreen && (
          <div className="absolute -inset-3 bg-gradient-to-tr from-lime-300 to-emerald-300 rounded-[40px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700"></div>
        )}

        <div
          className={`relative h-full w-full overflow-hidden bg-slate-100 ${
            isFullScreen
              ? ""
              : "rounded-[32px] border-[6px] border-white ring-1 ring-slate-100 shadow-2xl"
          }`}
        >
          <Map />

          {isFullScreen && (
            <button
              onClick={onCloseMap}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 px-6 py-2 rounded-full shadow-2xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
            >
              <Minimize2 size={18} />
              Keluar Fullscreen
            </button>
          )}

          {!isFullScreen && (
            <button
              onClick={onOpenMap}
              className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur text-slate-600 p-2.5 rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-all border border-white/50 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              title="Perbesar Peta"
            >
              <Maximize2 size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
