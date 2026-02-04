# WebGIS 1.1

Proyek ini adalah aplikasi Sistem Informasi Geografis (GIS) berbasis web yang dibangun menggunakan Next.js. Aplikasi ini memungkinkan pengelolaan data lokasi (Point of Interest) dengan visualisasi peta interaktif dan manajemen admin.

## Fitur Utama

- **Peta Interaktif**: Visualisasi lokasi menggunakan Leaflet dengan fitur marker clustering untuk performa optimal.
- **Manajemen Data (CRUD)**: Admin dapat menambah, melihat, memperbarui, dan menghapus data lokasi (*Place*).
- **Autentikasi Admin**: Sistem login aman untuk mengelola data menggunakan NextAuth.js.
- **Visualisasi Data**: Dashboard yang menyertakan grafik/chart menggunakan Recharts.
- **Pencarian & Filtrasi**: Memudahkan pencarian lokasi berdasarkan kategori atau nama.

## Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Database & ORM**: PostgreSQL dengan Prisma ORM
- **Styling**: Tailwind CSS & Radix UI
- **Peta**: Leaflet, React-Leaflet, dan React-Leaflet-Cluster
- **Autentikasi**: NextAuth.js
- **Grafik**: Recharts

## Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:
- Node.js (versi terbaru disarankan)
- PostgreSQL Database
- Package Manager (NPM, Yarn, atau PNPM)

## Instalasi

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/username/gis-dev.git](https://github.com/username/gis-dev.git)
    cd GIS-Dev
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable:**
    Buat file `.env` di direktori utama dan tambahkan kredensial database Anda:
    ```text
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    NEXTAUTH_SECRET="your-secret-key"
    ```

4.  **Setup Database (Prisma):**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Contoh Penggunaan

-   **Melihat Peta**: Akses halaman utama untuk melihat semua titik lokasi yang terdaftar.
-   **Login Admin**: Masuk ke direktori `/auth/login` untuk mengakses fitur manajemen data.
-   **Input Data**: Gunakan form di halaman admin untuk menambahkan koordinat (Latitude/Longitude) serta informasi tempat seperti kategori dan gambar.

