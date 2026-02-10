"use client";

import Link from "next/link";
import {
  Menu,
  X,
  MapPin,
  Plus,
  Map,
  HomeIcon,
  DoorOpenIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// --- INTERFACES ---
interface AdminSidebarProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMinimized: boolean;
  active: boolean;
}

// --- MAIN COMPONENT ---
export default function AdminSidebar({
  isMinimized,
  setIsMinimized,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Helper agar active state mendeteksi sub-path juga (misal /admin/data/edit tetap aktif di Data Lokasi)
  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true;
    if (path !== "/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={`${
        isMinimized ? "w-20" : "w-64"
      } bg-black h-screen fixed left-0 top-0 border-r border-zinc-900 transition-all duration-300 ease-in-out flex flex-col z-50`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center ${
          isMinimized ? "justify-center" : "justify-between"
        } p-6 mb-2`}
      >
        {!isMinimized && (
          <h1 className="text-xl font-bold tracking-tight text-white">
            GIS<span className="text-lime-500">App</span>
          </h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 rounded-lg transition-colors hover:bg-zinc-900 text-zinc-500 hover:text-white"
          title={isMinimized ? "Buka Menu" : "Tutup Menu"}
        >
          {isMinimized ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 space-y-1">
        <NavItem
          href="/admin"
          icon={<HomeIcon size={20} />}
          label="Dashboard"
          isMinimized={isMinimized}
          active={isActive("/admin") && pathname === "/admin"} // Strict check untuk dashboard
        />
        <NavItem
          href="/admin/data"
          icon={<MapPin size={20} />}
          label="Data Lokasi"
          isMinimized={isMinimized}
          active={isActive("/admin/data")}
        />
        <NavItem
          href="/admin/input"
          icon={<Plus size={20} />}
          label="Tambah Baru"
          isMinimized={isMinimized}
          active={isActive("/admin/input")}
        />
        <NavItem
          href="/map"
          icon={<Map size={20} />}
          label="Peta Digital"
          isMinimized={isMinimized}
          active={isActive("/map")}
        />

        {/* Divider Simple */}
        <div className="my-6 mx-3 h-px bg-zinc-900" />

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-zinc-900 text-zinc-500 hover:text-red-400 ${
            isMinimized ? "justify-center" : ""
          }`}
          title={isMinimized ? "Logout" : ""}
        >
          <div className="shrink-0">
            <DoorOpenIcon size={20} />
          </div>
          {!isMinimized && <span className="text-sm font-medium">Logout</span>}
        </button>
      </nav>

      {/* FOOTER */}
      {!isMinimized && (
        <div className="p-6 border-t border-zinc-900">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">
            GIS Admin v1.0
          </p>
        </div>
      )}
    </aside>
  );
}

// NAV ITEM COMPONENT
function NavItem({ href, icon, label, isMinimized, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
        ${
          active
            ? "bg-lime-500/10 text-lime-500 border border-lime-500/20" // Aktif
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" // Tidak Aktif 
        } 
        ${isMinimized ? "justify-center" : ""}
      `}
      title={isMinimized ? label : ""}
    >
      <div
        className={`shrink-0 transition-colors ${
          active ? "text-lime-500" : "text-zinc-500 group-hover:text-zinc-300"
        }`}
      >
        {icon}
      </div>

      {!isMinimized && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
