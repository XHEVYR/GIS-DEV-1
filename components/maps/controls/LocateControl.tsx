import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { Navigation } from "lucide-react";

export function LocateControl({
  onLocationFound,
}: {
  onLocationFound: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const LocateControlClass = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-custom",
        );
        container.style.backgroundColor = "white";
        container.style.width = "34px";
        container.style.height = "34px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.cursor = "pointer";
        container.innerHTML = renderToString(
          <Navigation size={20} color="black" />,
        );
        container.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!navigator.geolocation) {
            alert("Browser tidak support GPS");
            return;
          }
          container.style.opacity = "0.5";
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.flyTo([latitude, longitude], 16);
              onLocationFound(latitude, longitude);
              container.style.opacity = "1";
            },
            () => {
              alert("Gagal ambil lokasi");
              container.style.opacity = "1";
            },
            { enableHighAccuracy: true },
          );
        };
        return container;
      },
    });
    const ctrl = new LocateControlClass();
    map.addControl(ctrl);
    return () => {
      map.removeControl(ctrl);
    };
  }, [map, onLocationFound]);
  return null;
}
