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
            id: "asc",
          },
        },
        detail: true,
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
      { status: 500 },
    );
  }
}

// POST: Simpan Data Baru + Banyak Gambar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Data POST diterima:", body);

    const lat = parseFloat(body.lat);
    const lon = parseFloat(body.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Lat/Lon harus angka" },
        { status: 400 },
      );
    }

    // Pastikan body.images adalah array, jika tidak (atau kosong), jadikan array kosong
    const imagesToSave = Array.isArray(body.images) ? body.images : [];

    const newPlace = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        lat: lat,
        lon: lon,
        category: body.category,

        // --- LOGIKA BARU: MULTI IMAGE ---
        // Kita tidak lagi pakai 'image', tapi 'placeImages'
        placeImages: {
          create: imagesToSave.map((imgUrl: string) => ({
            url: imgUrl,
          })),
        },

        // --- LOGIKA BARU: DETAIL (By Category) ---
        detail: body.detail
          ? {
              create: {
                accessInfo: body.detail.accessInfo,
                priceInfo: body.detail.priceInfo,
                facilities: body.detail.facilities,
                contactInfo: body.detail.contactInfo,
                webUrl: body.detail.webUrl,
              },
            }
          : undefined,
      },
    });

    console.log("Berhasil disimpan:", newPlace);
    return NextResponse.json(newPlace);
  } catch (error) {
    console.error("GAGAL SAVE DATABASE:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data ke database" },
      { status: 500 },
    );
  }
}
