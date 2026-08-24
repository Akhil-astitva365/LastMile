import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Minimize2, MapPin } from 'lucide-react';

// Custom High-Visibility SVG DivIcons for Leaflet Markers
const pickupIcon = L.divIcon({
  className: 'custom-map-marker-pickup',
  html: `<div style="background-color: #000000; color: #ffffff; border: 2px solid #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.8);">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const dropIcon = L.divIcon({
  className: 'custom-map-marker-drop',
  html: `<div style="background-color: #ffffff; color: #000000; border: 2px solid #000000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.8);">🏁</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const agentIcon = L.divIcon({
  className: 'custom-map-marker-agent',
  html: `<div style="background-color: #000000; color: #ffffff; border: 2px solid #ffffff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 14px rgba(0,0,0,0.9);">🚚</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

interface MapViewProps {
  pickupLat?: number;
  pickupLon?: number;
  dropLat?: number;
  dropLon?: number;
  agentLat?: number;
  agentLon?: number;
  agentName?: string;
  showExpandButton?: boolean;
}

function MapRecenter({ center, bounds }: { center: [number, number]; bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (bounds && bounds.length > 0) {
        try {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } catch (e) {
          map.setView(center, 9);
        }
      } else {
        map.setView(center, 9);
      }
    }, 150);

    return () => clearTimeout(timer);
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const validPickupLat = Number.isFinite(pickupLat) ? pickupLat : 23.2599;
  const validPickupLon = Number.isFinite(pickupLon) ? pickupLon : 77.4126;
  const validDropLat = Number.isFinite(dropLat) ? dropLat : 22.7196;
  const validDropLon = Number.isFinite(dropLon) ? dropLon : 75.8577;

  const centerLat = (validPickupLat + validDropLat) / 2;
  const centerLon = (validPickupLon + validDropLon) / 2;

  const positions: [number, number][] = [
    [validPickupLat, validPickupLon],
    [validDropLat, validDropLon],
  ];

  if (agentLat && agentLon && Number.isFinite(agentLat) && Number.isFinite(agentLon)) {
    positions.push([agentLat, agentLon]);
  }

  const renderMapContainer = (heightStyle: string = "100%") => (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: heightStyle, width: '100%', minHeight: '300px' }}
      className="w-full h-full rounded-2xl z-0"
    >
      <MapRecenter center={[centerLat, centerLon]} bounds={positions} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Pickup Marker */}
      <Marker position={[validPickupLat, validPickupLon]} icon={pickupIcon}>
        <Popup>
          <div className="text-xs font-bold text-black font-helvetica">📍 Pickup Location</div>
        </Popup>
      </Marker>

      {/* Drop Marker */}
      <Marker position={[validDropLat, validDropLon]} icon={dropIcon}>
        <Popup>
          <div className="text-xs font-bold text-black font-helvetica">🏁 Drop Location</div>
        </Popup>
      </Marker>

      {/* Agent Marker if available */}
      {agentLat && agentLon && Number.isFinite(agentLat) && Number.isFinite(agentLon) && (
        <Marker position={[agentLat, agentLon]} icon={agentIcon}>
          <Popup>
            <div className="text-xs font-bold text-black font-helvetica">🚚 {agentName}</div>
          </Popup>
        </Marker>
      )}

      <Polyline positions={[[validPickupLat, validPickupLon], [validDropLat, validDropLon]]} color="#000000" weight={6} opacity={0.9} />
      <Polyline positions={[[validPickupLat, validPickupLon], [validDropLat, validDropLon]]} color="#ffffff" weight={3} dashArray="6, 8" />
    </MapContainer>
  );

  return (
    <>
      {/* Standard Map Frame */}
      <div className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl relative z-0 group bg-neutral-900">
        {renderMapContainer("100%")}
      </div>

      {/* 16:9 Widescreen Expanded Map Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[1000] p-4 sm:p-6 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl ios-glass-panel p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white text-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide font-playfair">16:9 WIDESCREEN MAP VIEW</h3>
                <p className="text-xs text-neutral-400 font-helvetica">Interactive PAN-India Telemetry Route Map</p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 font-helvetica"
            >
              <Minimize2 className="w-4 h-4" /> CLOSE 16:9 VIEW
            </button>
          </div>

          {/* 16:9 Widescreen Aspect-Ratio Container */}
          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/30 shadow-2xl relative bg-neutral-950">
            {renderMapContainer("100%")}
          </div>
        </div>
      )}
    </>
  );
};
