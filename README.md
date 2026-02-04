# WebGIS 1.1

Proyek ini adalah aplikasi Sistem Informasi Geografis (GIS) berbasis web yang dibangun menggunakan Next.js. Aplikasi ini memungkinkan pengelolaan data lokasi (Point of Interest) dengan visualisasi peta interaktif dan manajemen admin.

## 🌟 Fitur Utama

- **Peta Interaktif**: Visualisasi lokasi menggunakan Leaflet dengan fitur marker clustering untuk performa optimal.
- **Manajemen Data (CRUD)**: Admin dapat menambah, melihat, memperbarui, dan menghapus data lokasi (Place).
- **Autentikasi Admin**: Sistem login aman untuk mengelola data menggunakan NextAuth.js.
- **Visualisasi Data**: Dashboard yang menyertakan grafik/chart menggunakan Recharts.
- **Pencarian & Filtrasi**: Memudahkan pencarian lokasi berdasarkan kategori atau nama.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Database & ORM**: PostgreSQL dengan Prisma ORM
- **Styling**: Tailwind CSS & Radix UI
- **Peta**: Leaflet, React-Leaflet, dan React-Leaflet-Cluster
- **Autentikasi**: NextAuth.js
- **Grafik**: Recharts

## 📋 Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:
- Node.js (versi terbaru disarankan)
- PostgreSQL Database
- Package Manager (NPM, Yarn, atau PNPM)

## 🛠️ Instalasi

1. **Clone repository:**
   ```bash
   git clone [https://github.com/username/gis-dev.git](https://github.com/username/gis-dev.git)
   cd GIS-Dev
Instal dependensi:

Bash
npm install
Konfigurasi Environment Variable: Buat file .env di direktori utama dan tambahkan kredensial database Anda:

Cuplikan kode
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="your-secret-key"
Setup Database (Prisma):

Bash
npx prisma generate
npx prisma migrate dev --name init
Jalankan aplikasi:

Bash
npm run dev
Buka http://localhost:3000 di browser Anda.

📖 Contoh Penggunaan
Melihat Peta: Akses halaman utama untuk melihat semua titik lokasi yang terdaftar.

Login Admin: Masuk ke direktori /auth/login untuk mengakses fitur manajemen data.

Input Data: Gunakan form di halaman admin untuk menambahkan koordinat (Latitude/Longitude) serta informasi tempat seperti kategori dan gambar.

🤝 Kontribusi
Kontribusi selalu terbuka! Silakan ikuti langkah berikut:

Fork repository ini.

Buat branch fitur baru (git checkout -b fitur/NamaFitur).

Commit perubahan Anda (git commit -m 'Menambah fitur X').

Push ke branch tersebut (git push origin fitur/NamaFitur).

Buat Pull Request.

📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.
