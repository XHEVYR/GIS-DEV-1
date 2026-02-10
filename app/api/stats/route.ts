import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Menghitung total tempat
    const totalPlaces = await prisma.place.count();

    // Mengambil semua kategori unik dari database
    const aggregateCategories = await prisma.place.groupBy({
      by: ["category"],
    });

    const totalCategories = aggregateCategories.length;

    return NextResponse.json({
      totalPlaces,
      totalCategories,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 },
    );
  }
}
