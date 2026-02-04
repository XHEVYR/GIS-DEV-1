"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
// Import ReactDOMServer untuk render icon Lucide ke HTML string
import { renderToString } from "react-dom/server"; 
// Import Icon Lucide yang dibutuhkan
import { 
  X, Navigation, ChevronLeft, ChevronRight, 
  MapPin, Utensils, Bed, Mountain, Camera 
} from "lucide-react";

// --- TIPE DATA ---
interface Place {
  id: string;
  name: string;
  category: string;
  images: string[];
  description: string;
  address: string;
  lat: number;
  lon: number;
}

// --- FUNGSI GENERATOR ICON CUSTOM ---
const createCustomMarker = (category: string) => {
  let IconComponent;
  let bgColor;

  // Tentukan Icon & Warna berdasarkan Kategori
  switch (category.toLowerCase()) {
    case "wisata":
      IconComponent = <Camera size={18} color="white" />;
      bgColor = "#ec4899"; // Pink
      break;
    case "hotel":
      IconComponent = <Bed size={18} color="white" />;
      bgColor = "#3b82f6"; // Blue
      break;
    case "cafe":
      IconComponent = <Utensils size={18} color="white" />;
      bgColor = "#f59e0b"; // Amber
      break;
    // case "alam":
    //   IconComponent = <Mountain size={18} color="white" />;
    //   bgColor = "#10b981"; // Emerald
    //   break;
    default:
      IconComponent = <MapPin size={18} color="white" />;
      bgColor = "#6366f1"; // Indigo
  }

  // Render Icon React ke String HTML
  const iconHtml = renderToString(IconComponent);

  return L.divIcon({
    className: "custom-marker-pin", // Class untuk CSS (lihat style di bawah)
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <div style="transform: rotate(45deg); display: flex;">
          ${iconHtml}
        </div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42], // Ujung bawah pin
    popupAnchor: [0, -40],
  });
};

// Icon Lokasi User (Merah) - Tetap pakai gambar atau ubah ke divIcon juga bisa
const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="
      background-color: #ef4444; 
      width: 16px; height: 16px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);
    "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let color = "#51aada";
  if (count > 100) color = "#e41c3d";
  else if (count > 50) color = "#f97316";
  else if (count > 20) color = "#eab308";

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  });
};

// --- COMPONENT LOCATE CONTROL ---
function LocateControl({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const LocateControlClass = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
        container.style.backgroundColor = "white";
        container.style.width = "34px";
        container.style.height = "34px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.cursor = "pointer";
        container.innerHTML = renderToString(<Navigation size={20} color="black" />); // Pakai renderToString biar konsisten
        
        container.onclick = (e) => {
          e.preventDefault(); e.stopPropagation();
          if (!navigator.geolocation) { alert("Browser tidak support GPS"); return; }
          container.style.opacity = "0.5";
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.flyTo([latitude, longitude], 16);
              onLocationFound(latitude, longitude);
              container.style.opacity = "1";
            },
            () => { alert("Gagal ambil lokasi"); container.style.opacity = "1"; },
            { enableHighAccuracy: true }
          );
        };
        return container;
      },
    });
    const ctrl = new LocateControlClass();
    map.addControl(ctrl);
    return () => { map.removeControl(ctrl); };
  }, [map, onLocationFound]);
  return null;
}

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        setPlaces(validData);
        const allCats = new Set(validData.map((p: Place) => p.category));
        setVisibleCategories(allCats as Set<string>);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchPlaces();
  }, []);

  const categories = useMemo(() => Array.from(new Set(places.map((p) => p.category))), [places]);

  const toggleCategory = (cat: string, isVisible: boolean) => {
    setVisibleCategories((prev) => {
      const newSet = new Set(prev);
      if (isVisible) newSet.add(cat); else newSet.delete(cat);
      return newSet;
    });
  };

  useEffect(() => { if (selectedPlace) setCurrentImageIndex(0); }, [selectedPlace]);

  const nextImage = () => {
    if (!selectedPlace) return;
    setCurrentImageIndex((prev) => (prev === selectedPlace.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!selectedPlace) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedPlace.images.length - 1 : prev - 1));
  };

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Peta Jalan">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit">
            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" attribution='&copy; OSM'/>
          </LayersControl.BaseLayer>
          {categories.map((category) => (
            <LayersControl.Overlay checked name={category} key={category}>
              <LayerGroup eventHandlers={{ add: () => toggleCategory(category, true), remove: () => toggleCategory(category, false) }} />
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}><Popup>Lokasi Anda</Popup></Marker>}
        <LocateControl onLocationFound={(lat, lng) => setUserLocation({ lat, lng })} />

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} maxClusterRadius={80}>
          {places
            .filter((place) => visibleCategories.has(place.category))
            .map((place) => (
              <Marker 
                key={place.id} 
                position={[place.lat, place.lon]} 
                // GUNAKAN ICON CUSTOM DI SINI
                icon={createCustomMarker(place.category)} 
              >
                <Popup>
                  <div className="w-60">
                    {place.images && place.images.length > 0 && (
                      <img src={place.images[0]} alt={place.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                    )}
                    <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{place.address}</p>
                    <button onClick={() => setSelectedPlace(place)} className="w-full bg-blue-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-blue-700">Lihat Detail</button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* --- MODAL DETAIL CAROUSEL (SAMA SEPERTI SEBELUMNYA) --- */}
      {selectedPlace && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
            <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition z-20"><X size={24} className="text-gray-700" /></button>

            <div className="relative w-full h-64 sm:h-80 flex-shrink-0 bg-gray-900 group">
              {selectedPlace.images && selectedPlace.images.length > 0 ? (
                <>
                  <img src={selectedPlace.images[currentImageIndex]} alt={selectedPlace.name} className="w-full h-full object-cover transition-all duration-300" />
                  {selectedPlace.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {selectedPlace.images.map((_, idx) => (
                          <div key={idx} className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : ( <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada gambar</div> )}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{selectedPlace.category}</span>
                  <h2 className="text-3xl font-bold text-white mt-2">{selectedPlace.name}</h2>
               </div>
            </div>

            <div className="p-6 space-y-6">
              <div><h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-3">Deskripsi</h3><p className="text-gray-700 whitespace-pre-line">{selectedPlace.description || "-"}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div><h4 className="font-semibold text-gray-900 text-sm mb-1">Alamat</h4><p className="text-sm text-gray-600">{selectedPlace.address}</p></div>
                <div><h4 className="font-semibold text-gray-900 text-sm mb-1">Koordinat</h4><div className="flex flex-col gap-1 text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border"><span className="text-red-500">Lat: {selectedPlace.lat}</span><span className="text-blue-500">Lon: {selectedPlace.lon}</span></div></div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end"><button onClick={() => setSelectedPlace(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium">Tutup</button></div>
          </div>
        </div>
      )}
    </div>
  );
}