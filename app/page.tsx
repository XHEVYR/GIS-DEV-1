"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import Footer from "@/components/landing/Footer";

// Landing page component
export default function LandingPage() {
  // Fullscreen state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fix map resize on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  // Event handlers
  const handleOpenMap = () => setIsFullScreen(true);
  const handleCloseMap = () => setIsFullScreen(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-lime-200 selection:text-lime-900">
      {/* Navbar */}
      <Navbar
        isFullScreen={isFullScreen}
        onOpenMap={handleOpenMap}
        onScrollTo={handleScrollTo}
      />

      {/* Main content sections */}
      <main className="flex-1 pt-20">
        <HeroSection
          isFullScreen={isFullScreen}
          onOpenMap={handleOpenMap}
          onCloseMap={handleCloseMap}
        />

        <AboutSection />

        <CategoriesSection />
      </main>

      <Footer onOpenMap={handleOpenMap} onScrollTo={handleScrollTo} />
    </div>
  );
} 
