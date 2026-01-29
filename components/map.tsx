"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useState, useMemo } from 'react';
import L from 'leaflet';

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

const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom cluster icon dengan angka
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let color = '#51aada'; // Biru default

  if (count > 100) {
    color = '#e41c3d'; // Merah untuk >100
  } else if (count > 50) {
    color = '#f97316'; // Orange untuk >50
  } else if (count > 20) {
    color = '#eab308'; // Kuning untuk >20
  }

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  });
};

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch('/api/places');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetch:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const categories = useMemo(() => {
    const uniqueCats = new Set(places.map(p => p.category));
    return Array.from(uniqueCats);
  }, [places]);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MapContainer 
      center={[-8.098064989795585, 112.16514038306394]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="topright">
        
        <LayersControl.BaseLayer checked name="Peta Satelit">
          <TileLayer 
            url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Peta Jalan (OSM)">
           <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </LayersControl.BaseLayer>

        {/* Looping kategori dengan cluster custom */}
        {categories.map((category) => (
          <LayersControl.Overlay checked name={category} key={category}>
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={80}
              iconCreateFunction={createClusterCustomIcon}
            >
              {places
                .filter((place) => place.category === category)
                .map((place) => (
                  <Marker key={place.id} position={[place.lat, place.lon]} icon={icon}>
                    <Popup>
                      <div className="w-60">
                        {place.image && (
                          <img 
                            src={place.image} 
                            alt={place.name} 
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <b>Nama:</b> {place.name}<br/>
                        <b>Kategori:</b> {place.category}<br/>
                        <b>Alamat:</b> {place.address}<br/>
                        <b>Keterangan:</b> {place.description}<br/>
                      </div>
                    </Popup>
                  </Marker>
              ))}
            </MarkerClusterGroup>
          </LayersControl.Overlay>
        ))}

      </LayersControl>
    </MapContainer>
  );
}