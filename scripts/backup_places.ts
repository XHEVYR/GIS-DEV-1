import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting backup...");
    const places = await prisma.place.findMany({
      include: {
        placeImages: true,
      },
    });

    const backupPath = path.join(__dirname, "../backup_places_data.json");
    fs.writeFileSync(backupPath, JSON.stringify(places, null, 2));
    console.log(
      `Backup completed! ${places.length} places saved to ${backupPath}`,
    );
  } catch (e) {
    console.error("Backup failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
