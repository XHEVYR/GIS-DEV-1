"use client";

import dynamic from "next/dynamic";
import { MapPin, Activity } from "lucide-react";

// 1. IMPORT PETA (Sama persis dengan Landing Page)
const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      <p className="text-sm font-semibold animate-pulse">Memuat Peta Admin...</p>
    </div>
  ),
});

export default function AdminMapPage() {
  return (
    // Container Utama: Mengatur tinggi agar pas di layar admin (dikurangi header admin)
    <div className="flex flex-col h-[calc(100vh-130px)] gap-6">
      
      {/* 2. HEADER KECIL (Agar Admin tau ini halaman apa) */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Monitoring <span className="text-lime-600">Spasial</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Tinjauan lokasi GIS dalam mode administrator.
          </p>
        </div>
        
        {/* Indikator Live (Pemanis UI) */}
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
           <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
           </div>
           <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Real-Time Mode</span>
        </div>
      </div>

      {/* 3. CONTAINER PETA (Style disamakan dengan Landing Page) */}
      {/* Menggunakan border tebal putih, rounded besar, dan shadow */}
      <div className="flex-1 w-full bg-slate-200 rounded-[32px] overflow-hidden border-[6px] border-white ring-1 ring-slate-200 shadow-xl relative z-0 group">
         
         {/* Render Map */}
         <Map />
         
         {/* 4. OVERLAY BADGE (Sama persis dengan Landing Page) */}
         <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/50 transition-transform group-hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="bg-lime-100 p-2.5 rounded-xl">
                <MapPin className="text-lime-600 w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin Access</p>
                <div className="flex items-center gap-1.5">
                    <Activity size={14} className="text-lime-600" />
                    <p className="text-sm font-black text-slate-800">Full Control</p>
                </div>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
}