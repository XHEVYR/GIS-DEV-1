"use client";

import { Info } from "lucide-react";
import { Place } from "@/types";
import ActionButtons from "./ActionButtons";

interface PlaceTableProps {
  data: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string, name: string) => void;
}

export default function PlaceTable({
  data,
  onEdit,
  onDelete,
}: PlaceTableProps) {
  // 1. TAMPILAN JIKA DATA KOSONG
  if (data.length === 0) {
    return (
      <div className="p-20 text-center text-slate-500 bg-white rounded-[24px] border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
            <Info size={32} className="text-slate-400" />
          </div>
          <p className="font-bold text-lg text-slate-600">
            Data tidak ditemukan.
          </p>
          <p className="text-sm text-slate-400">
            Coba gunakan kata kunci pencarian lain.
          </p>
        </div>
      </div>
    );
  }

  // 2. TABEL DATA UTAMA
  return (
    <div className="w-full overflow-x-auto">
      {/* table-fixed: Mengunci lebar kolom */}
      <table className="w-full text-left table-fixed min-w-[1000px] border-collapse">
        {/* HEADER TABEL */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[25%]">
              Nama Tempat
            </th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%]">
              Kategori
            </th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%]">
              Koordinat
            </th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[30%]">
              Alamat
            </th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%] text-center">
              Aksi
            </th>
          </tr>
        </thead>

        {/* BODY TABEL */}
        <tbody className="divide-y divide-slate-200">
          {data.map((place, index) => (
            <tr
              key={place.id || index}
              // --- PERUBAHAN DISINI (HOVER EFFECT) ---
              // 1. bg-lime-500/5 -> Lime murni 5% (Bening, tidak butek)
              // 2. border-l-transparent -> Border kiri default transparan
              // 3. hover:border-l-lime-500 -> Saat hover, muncul garis hijau di kiri
              className="group border-l-4 border-l-transparent hover:bg-lime-500/10 hover:border-l-lime-500 transition-all duration-200 ease-in-out cursor-default"
            >
              {/* KOLOM 1: NAMA & BADGE IMG */}
              <td className="p-5 align-middle">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="font-bold text-slate-800 text-sm truncate w-full group-hover:text-lime-700 transition-colors">
                    {place.name}
                  </span>

                  {/* BADGE IMG */}
                  {place.image && (
                    <span className="inline-flex items-center justify-center rounded-[4px] bg-lime-100 border border-lime-300 px-1.5 py-[2px] text-[10px] font-black text-lime-800 tracking-tight shadow-sm">
                      IMG
                    </span>
                  )}
                </div>
              </td>

              {/* KOLOM 2: KATEGORI */}
              <td className="p-5 align-middle">
                <span
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg border tracking-wide inline-block shadow-sm ${
                    place.category === "wisata"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : place.category === "hotel"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {place.category.toUpperCase()}
                </span>
              </td>

              {/* KOLOM 3: KOORDINAT */}
              <td className="p-5 align-middle">
                <div className="font-mono text-[12px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold group-hover:text-lime-600 transition-colors">
                      Lat
                    </span>
                    {Number(place.lat).toFixed(6)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold group-hover:text-lime-600 transition-colors">
                      Lon
                    </span>
                    {Number(place.lon).toFixed(6)}
                  </div>
                </div>
              </td>

              {/* KOLOM 4: ALAMAT */}
              <td className="p-5 align-middle">
                <p
                  className="text-slate-600 text-[13px] leading-relaxed line-clamp-2 font-medium"
                  title={place.address}
                >
                  {place.address || "-"}
                </p>
              </td>

              {/* KOLOM 5: AKSI */}
              <td className="p-5 align-middle text-center">
                <ActionButtons
                  name={place.name}
                  onEdit={() => onEdit(place)}
                  onDelete={() => place.id && onDelete(place.id, place.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
