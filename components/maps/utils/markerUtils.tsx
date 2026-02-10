import L from "leaflet";
import { renderToString } from "react-dom/server";
import { MapPin, Utensils, Bed, Camera } from "lucide-react";

export const createCustomMarker = (category: string) => {
  let IconComponent;
  let bgColor;

  switch (category.toLowerCase()) {
    case "wisata":
      IconComponent = <Camera size={18} color="white" />;
      bgColor = "#ec4899";
      break;
    case "hotel":
      IconComponent = <Bed size={18} color="white" />;
      bgColor = "#3b82f6";
      break;
    case "cafe":
      IconComponent = <Utensils size={18} color="white" />;
      bgColor = "#f59e0b";
      break;
    default:
      IconComponent = <MapPin size={18} color="white" />;
      bgColor = "#6366f1";
  }

  const iconHtml = renderToString(IconComponent);

  return L.divIcon({
    className: "custom-marker-pin",
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
    iconAnchor: [16, 42],
    popupAnchor: [0, -40],
  });
};

export const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Cluster {
  getChildCount: () => number;
}

export const createClusterCustomIcon = (cluster: Cluster) => {
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
