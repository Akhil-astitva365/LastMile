import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import api from '../services/api';

interface LocationSuggestion {
  latitude: number;
  longitude: number;
  placeName: string;
  pincode?: string;
}

interface LocationAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type city, landmark, or address...',
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || value.trim().length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get<LocationSuggestion[]>(`/locations/suggestions?query=${encodeURIComponent(value)}`);
        setSuggestions(res.data || []);
        if (res.data && res.data.length > 0) {
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Failed to fetch location suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (placeName: string) => {
    onChange(placeName);
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <label className="block text-white font-impact text-xs uppercase tracking-wider pl-1 flex items-center justify-between">
        <span>{label}</span>
        {isLoading && <span className="text-[10px] text-orange-400 font-royale text-sm animate-pulse capitalize">searching...</span>}
      </label>

      <div className="relative">
        <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-3.5 z-10" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-white text-xs font-medium focus:outline-none placeholder:text-neutral-600 shadow-sm"
        />
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-black/95 rounded-2xl p-2 shadow-2xl border border-orange-500/40 max-h-60 overflow-y-auto">
          <div className="text-[10px] font-impact uppercase tracking-widest text-neutral-400 px-3 py-1.5 flex items-center gap-1">
            <Search className="w-3 h-3 text-orange-500" /> LOCATION SUGGESTIONS
          </div>
          <div className="space-y-1">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item.placeName)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-500/20 hover:text-orange-400 transition-all flex items-start gap-2 text-xs group"
              >
                <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white group-hover:text-orange-400 truncate">{item.placeName}</div>
                  <div className="text-[10px] text-neutral-400 font-medium">
                    {item.pincode ? `Pincode: ${item.pincode} • ` : ''}Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
