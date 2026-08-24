import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Maximize2, Minimize2, X, MapPin } from 'lucide-react';

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
  showExpandButton?: boolean;
}

function MapRecenter({ center, bounds }: { center: [number, number]; bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
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
  showExpandButton = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const centerLat = (pickupLat + dropLat) / 2;
  const centerLon = (pickupLon + dropLon) / 2;

  const positions: [number, number][] = [
    [pickupLat, pickupLon],
    [dropLat, dropLon],
  ];

  if (agentLat && agentLon) {
    positions.push([agentLat, agentLon]);
  }

  const renderMapContainer = (heightClass: string = "h-full") => (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={8}
      scrollWheelZoom={true}
      className={`w-full ${heightClass}`}
    >
      <MapRecenter center={[centerLat, centerLon]} bounds={positions} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Pickup Marker */}
      <Marker position={[pickupLat, pickupLon]} icon={defaultIcon}>
        <Popup>
          <div className="text-xs font-bold text-black">📍 Pickup Location</div>
        </Popup>
      </Marker>

      {/* Drop Marker */}
      <Marker position={[dropLat, dropLon]} icon={defaultIcon}>
        <Popup>
          <div className="text-xs font-bold text-black">🏁 Drop Location</div>
        </Popup>
      </Marker>

      {/* Agent Marker if available */}
      {agentLat && agentLon && (
        <Marker position={[agentLat, agentLon]} icon={defaultIcon}>
          <Popup>
            <div className="text-xs font-bold text-black">🚚 {agentName}</div>
          </Popup>
        </Marker>
      )}

      <Polyline positions={[[pickupLat, pickupLon], [dropLat, dropLon]]} color="#ffffff" weight={5} dashArray="6, 8" />
    </MapContainer>
  );

  return (
    <>
      {/* Standard Map Frame */}
      <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-neutral-800 shadow-inner relative z-0 group">
        {renderMapContainer("h-full")}

        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute top-3 right-3 z-[400] px-3 py-1.5 rounded-full bg-black/90 border border-white/30 text-white font-bold text-xs hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-xl active:scale-95"
            title="Expand Map to Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>EXPAND MAP</span>
          </button>
        )}
      </div>

      {/* Full-Screen Expanded Map Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[1000] p-4 sm:p-6 bg-black/90 backdrop-blur-md flex flex-col space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between ios-glass-panel p-4 rounded-2xl bg-black border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white text-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide font-playfair">FULL-SCREEN MAP VIEW</h3>
                <p className="text-xs text-neutral-400 font-helvetica">Interactive PAN-India Leaflet Route Map</p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Minimize2 className="w-4 h-4" /> EXIT FULLSCREEN
            </button>
          </div>

          <div className="flex-1 w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative">
            {renderMapContainer("h-full")}
          </div>
        </div>
      )}
    </>
  );
};
