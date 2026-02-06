"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconFix = () => {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })
    ._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

iconFix();

// Komponen Child untuk menangani logika Peta
function LocationMarker({
  onSelect,
  position,
}: {
  onSelect: (lat: number, lon: number) => void;
  position: [number, number] | null;
}) {
  const map = useMap();

  // Gerakkan peta ke posisi marker
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);

  // Panggil fungsi onSelect
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Tampilkan Marker hanya jika posisi ada
  return position === null ? null : <Marker position={position}></Marker>;
}

interface MapInputProps {
  onLocationSelect: (lat: number, lon: number) => void;
  inputLat?: number;
  inputLon?: number;
}

export default function MapInput({
  onLocationSelect,
  inputLat,
  inputLon,
}: MapInputProps) {
  // Tentukan posisi marker: Prioritas dari Input Manual, jika tidak ada null
  const position: [number, number] | null =
    inputLat && inputLon ? [inputLat, inputLon] : null;

  const defaultCenter: [number, number] = [
    -8.097957655926255, 112.16521686600117,
  ];

  return (
    <MapContainer
      center={position || defaultCenter}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 1 }} // zIndex penting agar marker tidak tertutup layer lain
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Panggil komponen Logic di dalam MapContainer */}
      <LocationMarker onSelect={onLocationSelect} position={position} />
    </MapContainer>
  );
}
