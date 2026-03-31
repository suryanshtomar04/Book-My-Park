import React, { useState, useEffect, useRef } from 'react';
import ParkingCard from '../components/ParkingCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllParking, getNearbyParking } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { generateMockSpots, calculateDistance } from '../utils/distance';

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

// Fallback center if location completely fails
const DEFAULT_CENTER = [28.6139, 77.2090]; // New Delhi

// Sub-component to seamlessly fly the map to the active parking coordinates
function MapFlyToUpdater({ activeParkingId, parkings, markerRefs }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeParkingId) {
      const activeLocation = parkings.find(p => p._id === activeParkingId);
      if (activeLocation && activeLocation.location && activeLocation.location.coordinates) {
        const [lng, lat] = activeLocation.location.coordinates;
        // Fly smoothly to location
        map.flyTo([lat, lng], 15, {
          animate: true,
          duration: 1.2
        });
        
        // Temporarily open the popup for visual clarity
        const marker = markerRefs.current[activeParkingId];
        if (marker) {
          // Slight delay prevents glitchy visual pop logic over the flyTo animation
          setTimeout(() => marker.openPopup(), 200);
        }
      }
    }
  }, [activeParkingId, parkings, map, markerRefs]);
  
  return null;
}

// Reusable Filter Pill UI matching minimalist modern logic
const FilterPill = ({ label }) => (
  <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-800 hover:text-gray-900 rounded-full text-[13px] font-medium text-gray-700 transition-all whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-gray-300">
    {label}
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

export default function Explore() {
  const { lat, lng, address, loading: locationLoading } = useLocation();
  const [activeParkingId, setActiveParkingId] = useState(null);
  const markerRefs = useRef({});
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicFallbacks, setDynamicFallbacks] = useState([]);

  useEffect(() => {
    // Wait until location is resolved (could be real or manual fallback)
    if (locationLoading) return;

    const fetchParkings = async () => {
      try {
        setLoading(true);
        let res;
        if (lat && lng) {
          res = await getNearbyParking(lat, lng);
        } else {
          res = await getAllParking();
        }
        const data = Array.isArray(res) ? res : res.data || [];
        setParkings(data);
        
        // If empty, generate dynamic local mock spots based on user's coordinate
        if (data.length === 0 && lat && lng) {
           setDynamicFallbacks(generateMockSpots(lat, lng, address || 'Your Area'));
        }
      } catch (err) {
        console.error("Error fetching parkings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParkings();
  }, [lat, lng, address, locationLoading]);

  const displayParkings = parkings.length > 0 ? parkings : dynamicFallbacks;

  // Center based on user location first, then first parking spot, then default
  const center = (lat && lng) 
    ? [lat, lng] 
    : (displayParkings.length > 0 && displayParkings[0].location?.coordinates
      ? [displayParkings[0].location.coordinates[1], displayParkings[0].location.coordinates[0]]
      : DEFAULT_CENTER);

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
      
      {/* Left Side: Parking Listings (45%) */}
      {/* Enabled native kinetic smooth-scrolling and engaged custom scrollbar hiding class */}
      <div className="w-[45%] h-full overflow-y-auto scroll-smooth bg-white flex-shrink-0 hide-scrollbar relative z-10 shadow-lg">
        
        {/* Responsive, unbounded full-width inner container */}
        <div className="w-full">
          
          {/* Premium Header Area */}
          <div className="pt-[110px] px-8 lg:px-12 pb-6 bg-white">
            <h1 className="text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-none">
              Spaces nearby
            </h1>
            <p className="text-[15px] text-gray-500 font-medium mt-4 tracking-wide">
              {loading ? 'Loading premium locations...' : `${displayParkings.length} premium locations available for instant booking`}
            </p>
          </div>

          {/* Sticky Filtering Bar perfectly isolating header and content */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-y border-gray-100 px-8 lg:px-12 py-3 flex items-center gap-3 overflow-x-auto hide-scrollbar shadow-sm">
            <FilterPill label="Price" />
            <FilterPill label="Availability" />
            <FilterPill label="Distance" />
            <FilterPill label="Space Type" />
          </div>

          {/* Cards Stack - Taking full width of padded container */}
          <div className="flex flex-col gap-8 px-8 lg:px-12 pt-8 pb-20">
            {loading || locationLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
              </div>
            ) : displayParkings.map((parking) => {
              const pLng = parking.location?.coordinates?.[0];
              const pLat = parking.location?.coordinates?.[1];
              const distance = (lat && lng && pLat && pLng) 
                ? calculateDistance(lat, lng, pLat, pLng)
                : null;
                
              return (
                <ParkingCard 
                  key={parking._id}
                  id={parking._id}
                  title={parking.description?.substring(0, 40) || 'Premium Parking Spot'}
                  location={parking.location?.address || 'City Center'}
                  price={parking.pricePerHour}
                  availability={typeof parking.availability === 'string' ? (parking.availability.toLowerCase() === 'full' ? 'Full' : 'Available') : 'Available'}
                  image={parking.images?.[0] || 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop'}
                  isActive={activeParkingId === parking._id}
                  distance={distance}
                  onClick={() => setActiveParkingId(parking._id)}
                />
              );
            })}
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
          {/* Map logical updater */}
          <MapFlyToUpdater 
            activeParkingId={activeParkingId} 
            parkings={displayParkings} 
            markerRefs={markerRefs} 
          />

          {/* Beautiful subtle generic map styling */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render markers perfectly onto the map */}
          {displayParkings.map((parking) => {
            if (!parking.location || !parking.location.coordinates) return null;
            const [lng, lat] = parking.location.coordinates;
            return (
              <Marker 
                key={`marker-${parking._id}`} 
                position={[lat, lng]}
                ref={(ref) => {
                  if (ref) markerRefs.current[parking._id] = ref;
                }}
                eventHandlers={{
                  click: () => setActiveParkingId(parking._id)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[120px]">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{parking.description?.substring(0, 30) || 'Premium Parking Spot'}</h3>
                    <p className="text-sm font-semibold text-[#3b5cf2]">₹{parking.pricePerHour} / hr</p>
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
