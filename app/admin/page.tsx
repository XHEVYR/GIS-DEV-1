"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Hotel,
  Coffee,
  Plane,
  Plus,
  Map,
  ArrowUpRight,
} from "lucide-react";
import ChartData from "@/components/dashboard/ChartData";
import { Place } from "@/types";

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        setPlaces(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- HITUNG STATISTIK ---
  const totalData = places.length;
  const hotelCount = places.filter((p) => p.category === "hotel").length;
  const cafeCount = places.filter((p) => p.category === "cafe").length;
  const wisataCount = places.filter((p) => p.category === "wisata").length;

  // --- LOADING STATE (Tema Lime) ---
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-lime-500"></div>
          <p className="text-slate-400 font-bold text-xs tracking-widest uppercase animate-pulse">
            Memuat Statistik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* --- 1. HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Dashboard <span className="text-lime-600">Overview</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Pantau perkembangan data geospasial Kota Blitar secara real-time.
          </p>
        </div>

        {/* Tanggal Hari Ini */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Update Terakhir
          </p>
          <p className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* --- 2. STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: TOTAL DATA (Tidak ada Link) */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 shadow-xl shadow-slate-900/20 text-white overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-lime-500/20 rounded-xl backdrop-blur-sm border border-lime-500/30 text-lime-400">
                <BarChart3 size={24} />
              </div>
              <p className="text-lime-400 text-xs font-bold uppercase tracking-widest">
                Total Data
              </p>
            </div>
            <p className="text-5xl font-black tracking-tight text-white mb-1">
              {totalData}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Lokasi Terdaftar
            </p>
          </div>
        </div>

        {/* CARD 2: HOTEL (Link ke ?q=hotel) */}
        <Link href="/admin/data?q=hotel" className="block group">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Hotel size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {totalData > 0 ? ((hotelCount / totalData) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 mb-1">
                {hotelCount}
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
                Hotel & Penginapan
              </p>
            </div>
          </div>
        </Link>

        {/* CARD 3: CAFE (Link ke ?q=cafe) */}
        <Link href="/admin/data?q=cafe" className="block group">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300 cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Coffee size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                {totalData > 0 ? ((cafeCount / totalData) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 mb-1">
                {cafeCount}
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
                Cafe & Resto
              </p>
            </div>
          </div>
        </Link>

        {/* CARD 4: WISATA (Link ke ?q=wisata) */}
        <Link href="/admin/data?q=wisata" className="block group">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-200 transition-all duration-300 cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Plane size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                {totalData > 0 ? ((wisataCount / totalData) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 mb-1">
                {wisataCount}
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
                Destinasi Wisata
              </p>
            </div>
          </div>
        </Link>

      </div>

      {/* --- 3. MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: CHART (Lebar 2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Statistik Kategori
              </h3>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500 block" title="Hotel"></span>
                <span className="h-3 w-3 rounded-full bg-orange-500 block" title="Cafe"></span>
                <span className="h-3 w-3 rounded-full bg-purple-500 block" title="Wisata"></span>
              </div>
            </div>
            <ChartData
              data={{
                hotel: hotelCount,
                cafe: cafeCount,
                wisata: wisataCount,
              }}
            />
          </div>
        </div>

        {/* RIGHT COL: QUICK ACTIONS & INFO (Lebar 1/3) */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/input"
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-lime-50 hover:border-lime-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-lime-600 shadow-sm">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-slate-800">
                    Tambah Data Baru
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-lime-500"
                />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm">
                    <Map size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-slate-800">
                    Lihat Peta Utama
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-500"
                />
              </Link>
            </div>
          </div>

          {/* System Status / Info Card */}
          <div className="bg-lime-900 rounded-[32px] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/30 blur-[50px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 blur-[40px] rounded-full"></div>

            <div className="relative z-10 text-center">
              <h4 className="text-lime-300 font-bold text-sm uppercase tracking-widest mb-1">
                Saat Ini (WIB)
              </h4>
              <p className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-white">
                {time.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p className="text-lime-100 font-medium text-sm">
                {time.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}