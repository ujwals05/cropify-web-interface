import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  region?: string;
}

interface MapSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation: LocationData | null;
  onClearLocation: () => void;
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapSelector({ onLocationSelect, selectedLocation, onClearLocation }: MapSelectorProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await res.json();
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state_district ||
        'Unknown';
      const region = address.state || address.country || '';

      onLocationSelect({ lat, lng, city, region });
    } catch {
      onLocationSelect({ lat, lng, city: `${lat.toFixed(2)}, ${lng.toFixed(2)}`, region: '' });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    reverseGeocode(lat, lng);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 10, { duration: 1.5 });
        }
        reverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Fly to selected location
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 10, { duration: 1 });
    }
  }, [selectedLocation]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-primary/80 px-1 flex items-center gap-2">
          <MapPin size={15} className="text-accent" />
          Select Location on Map
        </label>
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors px-2 py-1 rounded-lg hover:bg-accent/5 cursor-pointer"
        >
          {isLocating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Navigation size={13} />
          )}
          Use my location
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-muted/50 shadow-sm group">
        <div className="h-[220px] md:h-[260px]">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={handleMapClick} />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={greenIcon} />
            )}
          </MapContainer>
        </div>

        {/* Geocoding overlay */}
        <AnimatePresence>
          {isGeocoding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
            >
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-muted/30">
                <Loader2 size={16} className="animate-spin text-accent" />
                <span className="text-sm font-medium text-primary/70">Detecting location...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        {!selectedLocation && !isGeocoding && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-primary/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              Click anywhere on the map to select location
            </div>
          </div>
        )}
      </div>

      {/* Location Badge */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20"
          >
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-primary block truncate">
                📍 {selectedLocation.city}
                {selectedLocation.region ? `, ${selectedLocation.region}` : ''}
              </span>
              <span className="text-[10px] text-primary/40 font-medium">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClearLocation}
              className="w-6 h-6 rounded-full bg-primary/5 hover:bg-red-50 flex items-center justify-center text-primary/30 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
