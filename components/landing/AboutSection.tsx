import React, { useState, useEffect } from "react";

export default function AboutSection() {
  const [stats, setStats] = useState({ totalPlaces: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStats({
          totalPlaces: data.totalPlaces || 0,
          totalCategories: data.totalCategories || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Auto-refresh setiap 15 detik
    const intervalId = setInterval(fetchStats, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section
      id="about"
      className="py-24 px-6 bg-white relative overflow-hidden scroll-mt-20 border-y border-slate-100"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <h2 className="text-3xl md:text-4xl font-black leading-tight text-slate-900">
          Kenapa Menggunakan <br />
          <span className="text-lime-600">GIS App?</span>
        </h2>

        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
          Sistem ini dirancang untuk memudahkan masyarakat dan wisatawan. Tidak
          perlu bingung mencari lokasi, semua ada dalam satu genggaman.
        </p>

        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
            <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
              {loading ? "..." : `${stats.totalPlaces}+`}
            </div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Titik Lokasi Terdata
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
            <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
              {loading ? "..." : stats.totalCategories}
            </div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Kategori Utama
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
            <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
              24/7
            </div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Akses Real-Time
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
