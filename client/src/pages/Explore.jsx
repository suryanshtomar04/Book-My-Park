import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Fix for default Leaflet marker icons in React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom highlighted marker icon
const highlightedIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowSize: [50, 64],
  shadowAnchor: [15, 64],
  className: 'active-marker',
});

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
        map.flyTo([lat, lng], 15, {
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

const FilterPill = ({ label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-800 hover:text-gray-900 hover:brightness-95 rounded-full text-[13px] font-medium text-gray-700 transition-all duration-150 ease-out whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-sm"
  >
    {label}
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
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

// Card stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Explore() {
  const { lat, lng, address, loading: locationLoading } = useLocation();
  const routerLocation = useRouterLocation();
  const [activeParkingId, setActiveParkingId] = useState(null);
  const [hoveredParkingId, setHoveredParkingId] = useState(null);
  const markerRefs = useRef({});
  const cardRefs = useRef({});
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Center on first parking if exists, else fallback
  const firstCoords = displayParkings[0]?.location?.coordinates;
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
          <div className="pt-[110px] px-8 lg:px-12 pb-6 bg-white">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-none"
            >
              Spaces nearby
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[15px] text-gray-500 font-medium mt-4 tracking-wide"
            >
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
            </motion.p>
          </div>

          {/* Sticky Filtering Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-y border-gray-100 px-8 lg:px-12 py-3 flex items-center gap-3 overflow-x-auto hide-scrollbar shadow-sm">
            <FilterPill label="Price" />
            <FilterPill label="Availability" />
            <FilterPill label="Distance" />
            <FilterPill label="Space Type" />
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-8"
              >
                {displayParkings.map((parking) => {
                  const pLng = parking.location?.coordinates?.[0];
                  const pLat = parking.location?.coordinates?.[1];
                  const distance = (lat && lng && pLat && pLng) 
                    ? calculateDistance(lat, lng, pLat, pLng)
                    : null;
                    
                  return (
                    <motion.div key={parking._id} variants={cardVariants}>
                      <ParkingCard
                        ref={(el) => { if (el) cardRefs.current[parking._id] = el; }}
                        id={parking._id}
                        title={parking.title || parking.description?.substring(0, 40) || 'Premium Parking Spot'}
                        location={parking.location?.address || 'City Center'}
                        price={parking.pricePerHour}
                        availability={parking.availableSlots > 0 ? 'Available' : 'Full'}
                        image={parking.images?.[0] || 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop'}
                        isActive={activeParkingId === parking._id}
                        isHovered={hoveredParkingId === parking._id}
                        distance={distance}
                        onClick={() => setActiveParkingId(parking._id)}
                        onHoverStart={() => handleCardHoverStart(parking._id)}
                        onHoverEnd={handleCardHoverEnd}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
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

          {/* Render markers with highlight state */}
          {displayParkings.map((parking) => {
            if (!parking.location || !parking.location.coordinates) return null;
            const [lng, lat] = parking.location.coordinates;
            const isHighlighted = activeParkingId === parking._id || hoveredParkingId === parking._id;
            return (
              <Marker 
                key={`marker-${parking._id}`} 
                position={[lat, lng]}
                icon={isHighlighted ? highlightedIcon : defaultIcon}
                ref={(ref) => {
                  if (ref) markerRefs.current[parking._id] = ref;
                }}
                eventHandlers={{
                  click: () => handleMarkerClick(parking._id)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[120px]">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{parking.title || parking.description?.substring(0, 30) || 'Premium Parking Spot'}</h3>
                    <p className="text-sm font-semibold text-blue-600">₹{parking.pricePerHour} / hr</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
    </div>
  );
}
