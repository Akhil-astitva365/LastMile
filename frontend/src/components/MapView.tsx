import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet default icon configuration
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewProps {
  pickupLat?: number;
  pickupLon?: number;
  dropLat?: number;
  dropLon?: number;
  agentLat?: number;
  agentLon?: number;
  agentName?: string;
}

function MapRecenter({ center, bounds }: { center: [number, number]; bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      map.setView(center, 9);
    }
  }, [map, center, bounds]);
  return null;
}

export const MapView: React.FC<MapViewProps> = ({
  pickupLat = 23.2599,
  pickupLon = 77.4126,
  dropLat = 22.7196,
  dropLon = 75.8577,
  agentLat,
  agentLon,
  agentName = 'Assigned Agent',
}) => {
  const centerLat = (pickupLat + dropLat) / 2;
  const centerLon = (pickupLon + dropLon) / 2;

  const positions: [number, number][] = [
    [pickupLat, pickupLon],
    [dropLat, dropLon],
  ];

  if (agentLat && agentLon) {
    positions.push([agentLat, agentLon]);
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800 shadow-inner relative z-0">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapRecenter center={[centerLat, centerLon]} bounds={positions} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        <Marker position={[pickupLat, pickupLon]} icon={defaultIcon}>
          <Popup>
            <div className="text-xs font-bold text-emerald-600">📍 Pickup Location</div>
          </Popup>
        </Marker>

        {/* Drop Marker */}
        <Marker position={[dropLat, dropLon]} icon={defaultIcon}>
          <Popup>
            <div className="text-xs font-bold text-rose-600">🏁 Drop Location</div>
          </Popup>
        </Marker>

        {/* Agent Marker if available */}
        {agentLat && agentLon && (
          <Marker position={[agentLat, agentLon]} icon={defaultIcon}>
            <Popup>
              <div className="text-xs font-bold text-cyan-600">🚚 {agentName}</div>
            </Popup>
          </Marker>
        )}

        <Polyline positions={[[pickupLat, pickupLon], [dropLat, dropLon]]} color="#0284c7" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
};
