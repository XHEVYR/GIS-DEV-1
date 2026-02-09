"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Coffee,
  Plane,
  Globe,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

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

export default function LandingPage() {
  const { data: session } = useSession();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fix Leaflet Resize Bug saat Fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  const handleOpenMap = () => setIsFullScreen(true);
  const handleCloseMap = () => setIsFullScreen(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-lime-200 selection:text-lime-900">
      
      {/* --- NAVBAR --- */}
      <header
        className={`fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 transition-transform duration-300 ${isFullScreen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-lime-500/20 text-white">
              <Globe size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">
              GIS<span className="text-lime-500">App</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <button
              onClick={handleOpenMap}
              className="hover:text-lime-600 transition duration-200"
            >
              Peta Digital
            </button>
            <Link
              href="#about"
              onClick={(e) => handleScrollTo(e, "about")}
              className="hover:text-lime-600 transition duration-200"
            >
              Tentang
            </Link>
            <Link
              href="#categories"
              onClick={(e) => handleScrollTo(e, "categories")}
              className="hover:text-lime-600 transition duration-200"
            >
              Kategori
            </Link>
          </nav>

          <div className="flex gap-4">
            {session ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg ring-2 ring-slate-900 ring-offset-2"
              >
                <LayoutDashboard size={16} />
                Halo, {session.user?.name || "Admin"}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-6 py-2.5 text-xs font-bold text-white bg-lime-600 rounded-full hover:bg-lime-700 transition shadow-lg shadow-lime-200 ring-2 ring-lime-500 ring-offset-2"
              >
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        
        {/* --- HERO SECTION --- */}
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
              Eksplorasi potensi <strong>Kota & Kabupaten Blitar</strong>. Temukan lokasi Hotel, Kafe, dan Wisata dengan data yang akurat dan real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleOpenMap}
                className="flex items-center justify-center gap-3 px-8 py-4 text-white bg-slate-900 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200 group"
              >
                <Maximize2 size={20} className="group-hover:rotate-45 transition-transform duration-300"/> 
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
              className={`relative h-full w-full overflow-hidden bg-slate-100 ${isFullScreen ? "" : "rounded-[32px] border-[6px] border-white ring-1 ring-slate-100 shadow-2xl"}`}
            >
              <Map />

              {isFullScreen && (
                <button
                  onClick={handleCloseMap}
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 px-6 py-2 rounded-full shadow-2xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                >
                  <Minimize2 size={18} />
                  Keluar Fullscreen
                </button>
              )}

              {!isFullScreen && (
                <button
                  onClick={handleOpenMap}
                  className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur text-slate-600 p-2.5 rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-all border border-white/50 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                  title="Perbesar Peta"
                >
                  <Maximize2 size={20} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* --- SECTION TENTANG (WHITE BG) --- */}
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
              Sistem ini dirancang untuk memudahkan masyarakat dan wisatawan. Tidak perlu bingung mencari lokasi, semua ada dalam satu genggaman.
            </p>

            <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">30+</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Titik Lokasi Terdata
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">3</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Kategori Utama
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">24/7</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Akses Real-Time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION KATEGORI (SLATE BG) --- */}
        <section
          id="categories"
          className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20"
        >
          {/* Pattern Dot Halus */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="inline-block mb-3 px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Explore
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                Kategori Destinasi
              </h2>
              <p className="text-slate-500 font-medium">
                Pilih kategori di bawah ini untuk melihat persebaran lokasi pada peta.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Hotel */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Hotel & Penginapan
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Temukan tempat istirahat terbaik yang nyaman dan strategis.
                </p>
              </div>

              {/* Cafe */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Coffee size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Cafe & Restoran
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Tempat nongkrong hits dan kuliner lezat khas Blitar.
                </p>
              </div>

              {/* Wisata */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plane size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Destinasi Wisata
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Jelajahi keindahan alam dan situs sejarah yang memukau.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- PROFESSIONAL FOOTER (DARK THEME) --- */}
      <footer className="bg-black text-zinc-400 pt-10 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Kolom 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-1.5 rounded-lg text-white">
                  <Globe size={18} strokeWidth={3} />
                </div>
                <span className="font-black text-lg tracking-tight">
                  GIS <span className="text-lime-500">BLITAR</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                Platform pemetaan digital resmi untuk pariwisata dan ekonomi kreatif di Blitar Raya.
              </p>
            </div>

            {/* Kolom 2: Tautan */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Menu Utama
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={handleOpenMap}
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Peta Digital
                  </button>
                </li>
                <li>
                  <Link
                    href="#categories"
                    onClick={(e) => handleScrollTo(e, "categories")}
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Kategori Data
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Login Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Kantor Pusat
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-lime-600 shrink-0" />
                  <span className="leading-relaxed">
                    Jl. Merdeka No. 105,<br />
                    Kepanjen Kidul, Kota Blitar
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-lime-600 shrink-0" />
                  <span>info@blitarkota.go.id</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-lime-600 shrink-0" />
                  <span>(0342) 801xxx</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Sosial Media
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-lime-500 hover:text-white hover:border-lime-500 transition-all text-zinc-400"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-zinc-400"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all text-zinc-400"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-zinc-900/50 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-zinc-600">
              &copy; {new Date().getFullYear()} GIS BLITAR.
            </p>
            <p className="text-xs font-medium text-zinc-600 flex items-center gap-1">
               Developed by <span className="text-zinc-500">Adalah Pokoknya Mah</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}