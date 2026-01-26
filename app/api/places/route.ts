import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil semua data untuk Peta
export async function GET() {
  const places = await prisma.place.findMany();
  return NextResponse.json(places);
}

// POST: Simpan data baru dari Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPlace = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        lat: parseFloat(body.lat), // Pastikan jadi angka
        lon: parseFloat(body.lon),
        category: body.category,
      }
    });
    return NextResponse.json(newPlace);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal simpan' }, { status: 500 });
  }
}