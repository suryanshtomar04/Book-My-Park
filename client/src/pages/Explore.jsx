import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ParkingCard from '../components/ParkingCard';
import SkeletonCard from '../components/SkeletonCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllParking, getNearbyParking } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { calculateDistance } from '../utils/distance';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/FadeIn';

// Fix for default Leaflet marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom highlighted marker icon
const highlightedIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowSize: [50, 64],
  shadowAnchor: [15, 64],
  className: 'active-marker leaflet-marker-pulse',
});

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-drop hover-scale-marker',
});

// Fallback center if location completely fails
const DEFAULT_CENTER = [28.8329, 77.5770]; // Modinagar

// Sub-component to seamlessly fly the map to the active parking coordinates
function MapFlyToUpdater({ activeParkingId, parkings, markerRefs }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeParkingId) {
      const activeLocation = parkings.find(p => p._id === activeParkingId);
      if (activeLocation && activeLocation.location && activeLocation.location.coordinates) {
        const [lng, lat] = activeLocation.location.coordinates;
        map.flyTo([lat, lng], 16, { /* zoomed closer */
          animate: true,
          duration: 1.2
        });
        
        const marker = markerRefs.current[activeParkingId];
        if (marker) {
          setTimeout(() => marker.openPopup(), 200);
        }
      }
    }
  }, [activeParkingId, parkings, map, markerRefs]);
  
  return null;
}

// Smooth initial zoom animation
function MapZoomAnimator() {
  const map = useMap();
  useEffect(() => {
    // Start zoomed out slightly, then zoom in
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom - 2, { animate: false });
    setTimeout(() => {
      map.setZoom(currentZoom, { animate: true, duration: 1.5 });
    }, 300);
  }, [map]);
  return null;
}

const SortPill = ({ label, active, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-[13px] font-medium transition-all duration-150 ease-out whitespace-nowrap focus:outline-none focus:ring-1 shadow-sm ${
      active 
        ? 'bg-blue-50 border-blue-200 text-blue-700 ring-blue-300 shadow-blue-500/10' 
        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-800 hover:text-gray-900 pointer-events-auto'
    }`}
  >
    {label}
  </motion.button>
);

// ── Default parkings (always visible) ──
const defaultParkings = [
  {
    _id: "d1",
    title: "Modinagar Secure Parking",
    pricePerHour: 50,
    location: {
      address: "Modinagar",
      coordinates: [77.5770, 28.8329],
    },
    totalSlots: 20,
    availableSlots: 10,
    images: [],
  },
  {
    _id: "d2",
    title: "Highway Parking Lot",
    pricePerHour: 30,
    location: {
      address: "Meerut Road",
      coordinates: [77.5800, 28.8300],
    },
    totalSlots: 15,
    availableSlots: 5,
    images: [],
  },
  {
    _id: "d3",
    title: "City Center Parking",
    pricePerHour: 70,
    location: {
      address: "Modinagar Market",
      coordinates: [77.5750, 28.8350],
    },
    totalSlots: 25,
    availableSlots: 12,
    images: [],
  },
];


export default function Explore() {
  const { lat, lng, address, loading: locationLoading } = useLocation();
  const routerLocation = useRouterLocation();
  const [activeParkingId, setActiveParkingId] = useState(null);
  const [hoveredParkingId, setHoveredParkingId] = useState(null);
  const markerRefs = useRef({});
  const cardRefs = useRef({});
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Nearest');

  // Refetch on every navigation to /explore
  useEffect(() => {
    if (locationLoading) return;

    const fetchParkings = async () => {
      try {
        setLoading(true);
        const res = await getAllParking();
        const data = Array.isArray(res) ? res : res.data || [];
        console.log("FETCHED PARKINGS:", data);
        setParkings(data);
      } catch (err) {
        console.error("Error fetching parkings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParkings();
  }, [lat, lng, address, locationLoading, routerLocation.key]);

  // Merge defaults + real backend data, filtering out defaults that clash
  const backendIds = new Set(parkings.map(p => p._id));
  const displayParkings = [
    ...defaultParkings.filter(d => !backendIds.has(d._id)),
    ...parkings,
  ];

  const getDistance = useCallback((parking) => {
    const pLng = parking.location?.coordinates?.[0];
    const pLat = parking.location?.coordinates?.[1];
    return (lat && lng && pLat && pLng) 
      ? calculateDistance(lat, lng, pLat, pLng)
      : Infinity;
  }, [lat, lng]);

  const sortedParkings = useMemo(() => {
    let arr = [...displayParkings];
    if (sortBy === 'Cheapest') {
      arr.sort((a, b) => (a.pricePerHour || 0) - (b.pricePerHour || 0));
    } else if (sortBy === 'Nearest' && lat && lng) {
      arr.sort((a, b) => getDistance(a) - getDistance(b));
    } else if (sortBy === 'Best Rated') {
      arr.sort((a, b) => (b.rating || 5) - (a.rating || 5)); // dummy rating fallback
    }
    return arr;
  }, [displayParkings, sortBy, lat, lng, getDistance]);

  // Center on first parking if exists, else fallback
  const firstCoords = sortedParkings[0]?.location?.coordinates;
  const center = firstCoords
    ? [firstCoords[1], firstCoords[0]]
    : DEFAULT_CENTER;

  // When a marker is clicked → scroll to corresponding card
  const handleMarkerClick = useCallback((parkingId) => {
    setActiveParkingId(parkingId);
    const cardEl = cardRefs.current[parkingId];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // When card is clicked → just set active (MapFlyToUpdater zooms automatically)
  const handleCardClick = useCallback((parkingId) => {
    setActiveParkingId(parkingId);
  }, []);

  // When hovering a card → highlight the marker
  const handleCardHoverStart = useCallback((parkingId) => {
    setHoveredParkingId(parkingId);
    // Open popup on hover as well
    const marker = markerRefs.current[parkingId];
    if (marker) marker.openPopup();
  }, []);

  const handleCardHoverEnd = useCallback(() => {
    setHoveredParkingId(null);
  }, []);

  return (
    <div className="flex w-full h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* Left Side: Parking Listings (45%) */}
      <div className="w-[45%] h-full overflow-y-auto scroll-smooth bg-white flex-shrink-0 hide-scrollbar relative z-10 shadow-lg border-r border-gray-100">
        
        <div className="w-full">
          
          {/* Premium Header Area */}
          <FadeIn className="pt-[110px] px-8 lg:px-12 pb-6 bg-white">
            <h1 className="text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-none mb-4">
              Spaces nearby
            </h1>
            <p className="text-[15px] text-gray-500 font-medium tracking-wide">
              {loading ? (
                <span className="flex items-center gap-1.5">
                  Finding best spots near you
                  <span className="loading-dots text-blue-500">
                    <span></span><span></span><span></span>
                  </span>
                </span>
              ) : (
                `${displayParkings.length} premium locations available for instant booking`
              )}
            </p>
          </FadeIn>

          {/* Sticky Filtering Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-y border-gray-100 px-8 lg:px-12 py-3 flex items-center gap-3 overflow-x-auto hide-scrollbar shadow-sm">
            <SortPill label="Nearest" active={sortBy === 'Nearest'} onClick={() => setSortBy('Nearest')} />
            <SortPill label="Cheapest" active={sortBy === 'Cheapest'} onClick={() => setSortBy('Cheapest')} />
            <SortPill label="Best Rated" active={sortBy === 'Best Rated'} onClick={() => setSortBy('Best Rated')} />
          </div>

          {/* Cards Stack */}
          <div className="flex flex-col gap-8 px-8 lg:px-12 pt-8 pb-20">
            {loading || locationLoading ? (
              <>
                <SkeletonCard index={0} />
                <SkeletonCard index={1} />
                <SkeletonCard index={2} />
              </>
            ) : (
              <FadeIn delay={0.1} className="flex flex-col gap-8">
                {sortedParkings.map((parking) => {
                  const pLng = parking.location?.coordinates?.[0];
                  const pLat = parking.location?.coordinates?.[1];
                  const distance = (lat && lng && pLat && pLng) 
                    ? calculateDistance(lat, lng, pLat, pLng)
                    : null;
                    
                  return (
                    <div key={parking._id}>
                      <ParkingCard
                        ref={(el) => { if (el) cardRefs.current[parking._id] = el; }}
                        id={parking._id}
                        title={parking.title || parking.description?.substring(0, 40) || 'Premium Parking Spot'}
                        location={parking.location?.address || 'City Center'}
                        price={parking.pricePerHour}
                        availableSlots={parking.availableSlots}
                        totalSlots={parking.totalSlots}
                        distance={distance}
                        image={parking.images?.[0] || 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop'}
                        isActive={activeParkingId === parking._id}
                        isHovered={hoveredParkingId === parking._id}
                        onClick={() => handleCardClick(parking._id)}
                        onHoverStart={() => handleCardHoverStart(parking._id)}
                        onHoverEnd={handleCardHoverEnd}
                      />
                    </div>
                  );
                })}
              </FadeIn>
            )}
          </div>

        </div>
      </div>

      {/* Right Side: Leaflet Map View (55%) */}
      <div className="w-[55%] h-full relative z-0">
        <MapContainer 
          center={center} 
          zoom={14} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Map logical updaters */}
          <MapFlyToUpdater 
            activeParkingId={activeParkingId} 
            parkings={displayParkings} 
            markerRefs={markerRefs} 
          />
          <MapZoomAnimator />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render markers with highlight state and prevent overlaps */}
          {(() => {
            const coordsCount = {};
            return sortedParkings.map((parking) => {
              if (!parking.location || !parking.location.coordinates) return null;
              let [lng, lat] = parking.location.coordinates;
              
              const key = `${lat},${lng}`;
              const offsetIdx = coordsCount[key] || 0;
              coordsCount[key] = offsetIdx + 1;
              
              // Apply slight lat/lng offset (~15m) to avoid complete marker overlap
              if (offsetIdx > 0) {
                 lat += (offsetIdx * 0.00015);
                 lng += (offsetIdx * 0.00015);
              }

              const isHighlighted = activeParkingId === parking._id || hoveredParkingId === parking._id;
              
              return (
                <Marker 
                  key={`marker-${parking._id}-${offsetIdx}`} 
                  position={[lat, lng]}
                  icon={isHighlighted ? highlightedIcon : customIcon}
                  zIndexOffset={isHighlighted ? 1000 : 0}
                  ref={(ref) => {
                    if (ref) markerRefs.current[parking._id] = ref;
                  }}
                  eventHandlers={{
                    click: () => handleMarkerClick(parking._id)
                  }}
                >
                  <Popup className="premium-popup">
                    <div className="p-1 min-w-[180px]">
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {parking.title || parking.description?.substring(0, 40) || 'Premium Parking Spot'}
                      </h3>
                      <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-100">
                        <span className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Price</span>
                        <span className="font-bold text-blue-600 text-sm">₹{parking.pricePerHour}/hr</span>
                      </div>
                      <div className="mt-2.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkerClick(parking._id);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                          View & Book
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            });
          })()}
        </MapContainer>
      </div>
      
    </div>
  );
}
