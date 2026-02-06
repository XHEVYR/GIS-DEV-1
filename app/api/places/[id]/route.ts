import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT: Update Data Utama & Replace Gambar (Untuk Carousel)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Await params (Wajib di Next.js 15)
    const { id } = await params;
    const body = await request.json();

    console.log("Data UPDATE diterima:", body);

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    // 2. Validasi Angka
    const lat = parseFloat(body.lat);
    const lon = parseFloat(body.lon);
    
    // 3. Pastikan images adalah array
    const imagesToSave = Array.isArray(body.images) ? body.images : [];

    // 4. Update ke Database
    const updatedPlace = await prisma.place.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        category: body.category,
        lat: lat,
        lon: lon,
        
        // HAPUS kolom 'image' lama
        // image: body.image, 

        // LOGIKA BARU: REFRESH GAMBAR
        placeImages: {
          // A. Hapus semua gambar lama milik tempat ini
          deleteMany: {}, 
          
          // B. Masukkan ulang gambar baru sesuai urutan dari Frontend
          // Karena Prisma membuat ID berurutan, gambar pertama (index 0) 
          // akan punya ID terkecil -> jadi Foto Utama.
          create: imagesToSave.map((imgUrl: string) => ({
            url: imgUrl
          }))
        }
      },
      include: {
        placeImages: true // Return data lengkap dengan gambar barunya
      }
    });

    console.log("Berhasil di-update:", updatedPlace);
    return NextResponse.json(updatedPlace);

  } catch (error) {
    console.error("GAGAL UPDATE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data di database' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Data (Gambar otomatis terhapus karena Cascade)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("DELETE request ID:", id);

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    // Karena di schema.prisma kita set `onDelete: Cascade` pada PlaceImage,
    // Maka saat Place dihapus, semua PlaceImage-nya otomatis ikut terhapus.
    const deletedPlace = await prisma.place.delete({
      where: { id: parseInt(id) }
    });

    console.log("Berhasil di-delete:", deletedPlace);
    return NextResponse.json(deletedPlace);

  } catch (error) {
    console.error("GAGAL DELETE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal menghapus data dari database' },
      { status: 500 }
    );
  }
}