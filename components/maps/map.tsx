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
import { X } from "lucide-react";

// --- TIPE DATA ---
interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  address: string;
  lat: number;
  lon: number;
}

// Icon Default Tempat Wisata
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icon Lokasi User (Merah)
const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let color = "#51aada";
  if (count > 100) color = "#e41c3d";
  else if (count > 50) color = "#f97316";
  else if (count > 20) color = "#eab308";

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  });
};

// --- KOMPONEN LOCATE CONTROL (FIXED: NATIVE LEAFLET) ---
// Menggunakan L.Control agar tidak hilang saat fullscreen
function LocateControl({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const LocateControlClass = L.Control.extend({
      options: {
        position: "bottomright", // Posisi tombol
      },

      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");

        // Styling manual agar mirip tombol zoom bawaan Leaflet
        container.style.backgroundColor = "white";
        container.style.width = "34px";
        container.style.height = "34px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.cursor = "pointer";
        container.style.borderBottom = "none";
        
        // Icon SVG Navigation/Crosshair
        container.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
        `;

        container.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!navigator.geolocation) {
            alert("Browser tidak mendukung Geolocation");
            return;
          }

          // Indikator loading visual (opacity)
          container.style.opacity = "0.5";

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.5 });
              onLocationFound(latitude, longitude);
              container.style.opacity = "1";
            },
            (error) => {
              console.error("Error:", error);
              alert("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
              container.style.opacity = "1";
            },
            { enableHighAccuracy: true }
          );
        };

        return container;
      },
    });

    const locateControlInstance = new LocateControlClass();
    map.addControl(locateControlInstance);

    return () => {
      map.removeControl(locateControlInstance);
    };
  }, [map, onLocationFound]);

  return null;
}

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        setPlaces(validData);
        const allCats = new Set(validData.map((p: Place) => p.category));
        setVisibleCategories(allCats as Set<string>);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(places.map((p) => p.category)));
  }, [places]);

  const toggleCategory = (cat: string, isVisible: boolean) => {
    setVisibleCategories((prev) => {
      const newSet = new Set(prev);
      if (isVisible) newSet.add(cat);
      else newSet.delete(cat);
      return newSet;
    });
  };

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[-8.098064989795585, 112.16514038306394]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Peta Jalan (OSM)">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta Satelit">
            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" attribution='&copy; OSM'/>
          </LayersControl.BaseLayer>

          {categories.map((category) => (
            <LayersControl.Overlay checked name={category} key={category}>
              <LayerGroup
                eventHandlers={{
                  add: () => toggleCategory(category, true),
                  remove: () => toggleCategory(category, false),
                }}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {/* Marker User (Jika Lokasi Ditemukan) */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>Lokasi Anda Saat Ini</Popup>
          </Marker>
        )}

        {/* Tombol Locate Me (Native Control) */}
        <LocateControl 
          onLocationFound={(lat, lng) => setUserLocation({ lat, lng })} 
        />

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} maxClusterRadius={80}>
          {places
            // Filter marker agar cluster count akurat
            .filter((place) => visibleCategories.has(place.category))
            .map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lon]}
                icon={icon}
              >
                <Popup>
                  <div className="w-60">
                    {place.image && (
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{place.address}</p>
                    
                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="w-full bg-blue-600 text-white py-1.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Lihat Detail Lengkap
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* MODAL POPUP DETAIL */}
      {selectedPlace && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition z-10"
            >
              <X size={24} className="text-gray-700" />
            </button>

            <div className="relative w-full h-64 sm:h-80 flex-shrink-0 bg-gray-100">
              {selectedPlace.image ? (
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada gambar</div>
              )}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {selectedPlace.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-2">{selectedPlace.name}</h2>
               </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-3">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedPlace.description || "Tidak ada deskripsi tersedia."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Alamat Lengkap</h4>
                  <p className="text-sm text-gray-600">{selectedPlace.address}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Koordinat</h4>
                  <div className="flex flex-col gap-1 text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border">
                    <span className="text-red-500 font-medium">Lat: {selectedPlace.lat}</span>
                    <span className="text-blue-500 font-medium">Lon: {selectedPlace.lon}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedPlace(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}