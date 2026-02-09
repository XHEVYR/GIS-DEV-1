import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: {
        placeImages: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            id: 'asc', 
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data places" },
      { status: 500 }
    );
  }
}