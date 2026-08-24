import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, MapPin, ExternalLink, Navigation, Plus, Minus, RotateCcw } from 'lucide-react';

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
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(9);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);

  const validPickupLat = Number.isFinite(pickupLat) ? pickupLat : 23.2599;
  const validPickupLon = Number.isFinite(pickupLon) ? pickupLon : 77.4126;
  const validDropLat = Number.isFinite(dropLat) ? dropLat : 22.7196;
  const validDropLon = Number.isFinite(dropLon) ? dropLon : 75.8577;

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Google Maps Directions Embed URL with dynamic zoom
  const googleMapsEmbedUrl = `https://maps.google.com/maps?saddr=${validPickupLat},${validPickupLon}&daddr=${validDropLat},${validDropLon}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  // External Google Maps Route Navigation Link
  const externalGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${validPickupLat},${validPickupLon}&destination=${validDropLat},${validDropLon}&travelmode=driving`;

  const handleZoomIn = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setZoomLevel((prev) => {
      const next = Math.min(Math.round((prev + 0.4) * 10) / 10, 16);
      if (googleMapInstance.current) {
        googleMapInstance.current.setZoom(Math.round(next));
      }
      return next;
    });
  };

  const handleZoomOut = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setZoomLevel((prev) => {
      const next = Math.max(Math.round((prev - 0.4) * 10) / 10, 4);
      if (googleMapInstance.current) {
        googleMapInstance.current.setZoom(Math.round(next));
      }
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setZoomLevel(9);
    if (googleMapInstance.current) {
      googleMapInstance.current.setZoom(9);
    }
  };

  // Load Google Maps JS API if API key is provided
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setIsGoogleApiLoaded(true);
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleApiLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Render Google Maps Native JS API canvas when loaded
  useEffect(() => {
    if (!isGoogleApiLoaded || !mapRef.current || !window.google?.maps) return;

    const pickupPos = { lat: validPickupLat, lng: validPickupLon };
    const dropPos = { lat: validDropLat, lng: validDropLon };

    const mapOptions = {
      center: {
        lat: (validPickupLat + validDropLat) / 2,
        lng: (validPickupLon + validDropLon) / 2,
      },
      zoom: zoomLevel,
      disableDefaultUI: false,
      zoomControl: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
        { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
        { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
      ],
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    googleMapInstance.current = map;

    // Pickup Marker
    new window.google.maps.Marker({
      position: pickupPos,
      map,
      title: '📍 Pickup Location',
      label: { text: '📍', fontSize: '18px' },
    });

    // Drop Marker
    new window.google.maps.Marker({
      position: dropPos,
      map,
      title: '🏁 Drop Location',
      label: { text: '🏁', fontSize: '18px' },
    });

    // Agent Marker if available
    if (agentLat && agentLon && Number.isFinite(agentLat) && Number.isFinite(agentLon)) {
      new window.google.maps.Marker({
        position: { lat: agentLat, lng: agentLon },
        map,
        title: `🚚 ${agentName}`,
        label: { text: '🚚', fontSize: '20px' },
      });
    }

    // Polyline Route
    const routePath = [pickupPos];
    if (agentLat && agentLon && Number.isFinite(agentLat) && Number.isFinite(agentLon)) {
      routePath.push({ lat: agentLat, lng: agentLon });
    }
    routePath.push(dropPos);

    new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#ffffff',
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map,
    });

    // Fit Bounds
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupPos);
    bounds.extend(dropPos);
    if (agentLat && agentLon) {
      bounds.extend({ lat: agentLat, lng: agentLon });
    }
    map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
  }, [isGoogleApiLoaded, validPickupLat, validPickupLon, validDropLat, validDropLon, agentLat, agentLon, agentName]);

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    // Scroll up = Zoom in (+0.4), Scroll down = Zoom out (-0.4)
    if (e.deltaY < 0) {
      setZoomLevel((prev) => {
        const next = Math.min(Math.round((prev + 0.4) * 10) / 10, 16);
        if (googleMapInstance.current) {
          googleMapInstance.current.setZoom(Math.round(next));
        }
        return next;
      });
    } else if (e.deltaY > 0) {
      setZoomLevel((prev) => {
        const next = Math.max(Math.round((prev - 0.4) * 10) / 10, 4);
        if (googleMapInstance.current) {
          googleMapInstance.current.setZoom(Math.round(next));
        }
        return next;
      });
    }
  };

  const renderGoogleMap = (heightStyle: string = "100%") => {
    return (
      <div onWheel={handleWheelZoom} className="relative w-full h-full min-h-[350px] flex-1">
        {/* Floating Glassy Zooming Controls */}
        <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5 select-none">
          <button
            type="button"
            onClick={handleZoomIn}
            onTouchStart={handleZoomIn}
            title="Fine Zoom In (+0.4)"
            className="p-2 sm:p-2.5 rounded-full bg-black/75 backdrop-blur-xl border border-neutral-700 text-white hover:bg-white hover:text-black active:bg-white active:text-black transition-transform duration-75 shadow-2xl active:scale-90 flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            onTouchStart={handleZoomOut}
            title="Fine Zoom Out (-0.4)"
            className="p-2 sm:p-2.5 rounded-full bg-black/75 backdrop-blur-xl border border-neutral-700 text-white hover:bg-white hover:text-black active:bg-white active:text-black transition-transform duration-75 shadow-2xl active:scale-90 flex items-center justify-center cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            onTouchStart={handleResetZoom}
            title="Reset Zoom Level"
            className="p-2 sm:p-2.5 rounded-full bg-black/75 backdrop-blur-xl border border-neutral-700 text-white hover:bg-white hover:text-black active:bg-white active:text-black transition-transform duration-75 shadow-2xl active:scale-90 flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {apiKey && isGoogleApiLoaded ? (
          <div ref={mapRef} style={{ width: '100%', height: heightStyle, minHeight: '350px' }} className="rounded-2xl" />
        ) : (
          <iframe
            title="Google Maps Route View"
            src={googleMapsEmbedUrl}
            className="w-full h-full border-0 rounded-2xl filter saturate-[0.85] contrast-[1.05]"
            style={{ minHeight: '350px', height: heightStyle }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

        <div className="absolute bottom-3 right-3 z-10">
          <a
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-neutral-700 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 font-helvetica"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>OPEN IN GOOGLE MAPS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Standard Google Maps Frame */}
      <div className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl relative z-0 group bg-neutral-900">
        {renderGoogleMap("100%")}
      </div>

      {/* 16:9 Widescreen Expanded Google Map Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[1000] p-4 sm:p-6 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl ios-glass-panel p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white text-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide font-playfair">GOOGLE MAPS 16:9 VIEW</h3>
                <p className="text-xs text-neutral-400 font-helvetica">Official Google Maps Telemetry & Route Direction Service</p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 font-helvetica"
            >
              <Minimize2 className="w-4 h-4" /> CLOSE 16:9 VIEW
            </button>
          </div>

          {/* 16:9 Widescreen Container */}
          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/30 shadow-2xl relative bg-neutral-950">
            {renderGoogleMap("100%")}
          </div>
        </div>
      )}
    </>
  );
};

// Global TypeScript Window definition for Google Maps
declare global {
  interface Window {
    google?: any;
  }
}
