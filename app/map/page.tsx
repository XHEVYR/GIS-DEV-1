"use client";

import dynamic from "next/dynamic";

// Import Peta
const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 text-gray-500">
      Memuat Peta...
    </div>
  ),
});

export default function HomePage() {


      {/* Area Peta */}
      <div className="flex-1 relative z-0 bg-slate-100">
        <Map />
      </div>
}
