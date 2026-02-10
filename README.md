# Aplikasi Web GIS (WebGIS)

Aplikasi Web GIS yang lengkap dan interaktif, dibangun menggunakan Next.js. Aplikasi ini memungkinkan pengelolaan data spasial, visualisasi peta interaktif, dan dashboard admin yang komprehensif.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) dengan PostgreSQL
- **Peta**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Autentikasi**: [NextAuth.js](https://next-auth.js.org/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Komponen UI**: [Radix UI](https://www.radix-ui.com/)
- **Visualisasi Data**: [Recharts](https://recharts.org/) & [Three.js](https://threejs.org/)

## ✨ Fitur Utama

- **Peta Interaktif**: Menampilkan dan berinteraksi dengan titik data spasial (Hotel, Cafe, Objek Wisata).
- **Dashboard Admin**: Mengelola data tempat, melihat statistik, dan mengelola autentikasi pengguna.
- **Formulir Dinamis**: Mengelola jam operasional, fasilitas, dan detail lainnya dengan input yang fleksibel.
- **Clustering**: Menampilkan banyak marker secara efisien menggunakan teknik clustering pada peta.
- **Desain Responsif**: Tampilan yang optimal baik di desktop maupun perangkat mobile.

## 🛠️ Panduan Instalasi (Getting Started)

### Prasyarat

- [Node.js](https://nodejs.org/) (Disarankan versi LTS)
- [PostgreSQL](https://www.postgresql.org/) database

### Langkah Instalasi

1.  **Clone Repository**

    ```bash
    git clone <url-repository-anda>
    cd <direktori-project>
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**

    Buat file `.env` di direktori utama (root) dan sesuaikan variabel environment berikut:

    ```env
    # Koneksi Database
    DATABASE_URL="postgresql://user:password@localhost:5432/nama_database_anda"

    # Konfigurasi NextAuth
    NEXTAUTH_SECRET="kunci-rahasia-anda"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Setup Database**

    Generate Prisma client dan push schema ke database Anda:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Jalankan Aplikasi**

    Mulai server development:

    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📂 Struktur Project

- `app/`: Halaman dan layout menggunakan App Router.
- `components/`: Komponen UI yang dapat digunakan kembali (Peta, Form, Layout).
- `lib/`: Fungsi utilitas dan konfigurasi (Auth, Database).
- `prisma/`: Schema database dan migrasi.
- `types/`: Definisi tipe TypeScript.
- `public/`: Aset statis (Gambar, Ikon).
