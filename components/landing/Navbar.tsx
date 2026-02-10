"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Globe, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  isFullScreen: boolean;
  onOpenMap: () => void;
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function Navbar({
  isFullScreen,
  onOpenMap,
  onScrollTo,
}: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header
      className={`fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 transition-transform duration-300 ${
        isFullScreen ? "-translate-y-full" : "translate-y-0"
      }`}
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
            onClick={onOpenMap}
            className="hover:text-lime-600 transition duration-200"
          >
            Peta Digital
          </button>
          <Link
            href="#about"
            onClick={(e) => onScrollTo(e, "about")}
            className="hover:text-lime-600 transition duration-200"
          >
            Tentang
          </Link>
          <Link
            href="#categories"
            onClick={(e) => onScrollTo(e, "categories")}
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
  );
}
