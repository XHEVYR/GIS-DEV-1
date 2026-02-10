import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Auth components
import Providers from "@/components/auth/providers";
import AutoLogout from "@/components/auth/autoLogout";

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata
export const metadata: Metadata = {
  title: "GIS Kawasan Blitar",
  description: "Aplikasi WebGIS Data Lokasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Session provider & auto logout */}
        <Providers>
          <AutoLogout />
          {children}
        </Providers>
      </body>
    </html>
  );
}
