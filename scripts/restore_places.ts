import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    const backupPath = path.join(__dirname, "../backup_places_data.json");
    if (!fs.existsSync(backupPath)) {
      console.error("Backup file not found!");
      return;
    }

    const rawData = fs.readFileSync(backupPath, "utf-8");
    const places = JSON.parse(rawData);

    console.log(`Restoring ${places.length} places...`);

    for (const p of places) {
      // Kita abaikan 'id' agar auto-increment baru, ATAU kita paksa 'id' jika perlu relasi.
      // Untuk amannya, kita paksa ID agar link existing tidak putus (jika ada).
      // Tetapi karena kita baru saja reset, ID harusnya aman.

      const { id, placeImages, ...rest } = p;

      // Hapus field yang mungkin tidak ada di schema baru atau beda tipe (misal updated_at otomatis)
      // Prisma create akan handle default value.

      await prisma.place.create({
        data: {
          ...rest,
          // Opsional: id: id, // Uncomment jika ingin mempertahankan ID lama
          placeImages: {
            create: placeImages.map((img: any) => ({
              url: img.url,
            })),
          },
        },
      });
    }

    console.log("Restoration completed!");
  } catch (e) {
    console.error("Restoration failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
