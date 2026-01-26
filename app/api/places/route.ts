import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(places);
}

export async function POST(request: Request) {
  console.log(request);
  try {
    const body = await request.json();

    // 1. Cek Data Masuk di Terminal
    console.log("Data diterima dari Frontend:", body);

    // 2. Validasi Angka (PENTING! Mencegah NaN)
    const lat = parseFloat(body.lat);
    const lon = parseFloat(body.lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.log("Error: Latitude/Longitude bukan angka");
      return NextResponse.json({ error: 'Lat/Lon harus angka' }, { status: 400 });
    }

    // 3. Coba Simpan
    const newPlace = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        image: body.image,
        lat: lat,
        lon: lon,
        category: body.category,
      }
    });

    console.log("Berhasil disimpan:", newPlace);
    return NextResponse.json(newPlace);

  } catch (error) {
    // 4. MUNCULKAN ERROR DI TERMINAL
    console.error("GAGAL SAVE DATABASE:", error); 
    
    return NextResponse.json(
      { error: 'Gagal menyimpan data ke database' }, 
      { status: 500 }
    );
  }
}