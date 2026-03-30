import React, { useState, useEffect, useRef } from 'react';
import ParkingCard from '../components/ParkingCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Center of the map (NYC example)
const DEFAULT_CENTER = [40.7128, -74.0060];

const DUMMY_PARKINGS = [
  {
    id: '1',
    title: 'Downtown Premium Garage',
    location: '124 Main St, City Center',
    price: 8,
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: '2',
    title: 'Airport Long-Term Parking',
    location: 'Terminal B, Int. Airport',
    price: 15,
    availability: 'Full',
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819f04ab?q=80&w=800&auto=format&fit=crop',
    lat: 40.7150,
    lng: -74.0110
  },
  {
    id: '3',
    title: 'Mall Underground Secure',
    location: '445 West End Ave',
    price: 5,
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=800&auto=format&fit=crop',
    lat: 40.7110,
    lng: -73.9980
  },
  {
    id: '4',
    title: 'University Campus Standard',
    location: 'Student Union, North Campus',
    price: 3,
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1563534571-081686de6f8b?q=80&w=800&auto=format&fit=crop',
    lat: 40.7182,
    lng: -74.0142
  },
  {
    id: '5',
    title: 'Financial District Express',
    location: '88 Wall Street',
    price: 12,
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1587824874052-a27ddfb917bc?q=80&w=800&auto=format&fit=crop',
    lat: 40.7061,
    lng: -74.0011
  },
  {
    id: '6',
    title: 'Riverside Private Driveway',
    location: '202 River Road',
    price: 4,
    availability: 'Full',
    image: 'https://images.unsplash.com/photo-1522271815180-2a8d16ebf010?q=80&w=800&auto=format&fit=crop',
    lat: 40.7080,
    lng: -74.0080
  }
];

// Sub-component to seamlessly fly the map to the active parking coordinates
function MapFlyToUpdater({ activeParkingId, parkings, markerRefs }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeParkingId) {
      const activeLocation = parkings.find(p => p.id === activeParkingId);
      if (activeLocation) {
        // Fly smoothly to location
        map.flyTo([activeLocation.lat, activeLocation.lng], 15, {
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
  const [activeParkingId, setActiveParkingId] = useState(null);
  const markerRefs = useRef({});

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
      
      {/* Left Side: Parking Listings (45%) */}
      {/* Enabled native kinetic smooth-scrolling and engaged custom scrollbar hiding class */}
      <div className="w-[45%] h-full overflow-y-auto scroll-smooth bg-white flex-shrink-0 hide-scrollbar relative z-10 shadow-lg relative">
        
        {/* Responsive, unbounded full-width inner container */}
        <div className="w-full">
          
          {/* Premium Header Area */}
          <div className="pt-[110px] px-8 lg:px-12 pb-6 bg-white">
            <h1 className="text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-none">
              Spaces nearby
            </h1>
            <p className="text-[15px] text-gray-500 font-medium mt-4 tracking-wide">
              {DUMMY_PARKINGS.length} premium locations available for instant booking
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
            {DUMMY_PARKINGS.map((parking) => (
              <ParkingCard 
                key={parking.id}
                id={parking.id}
                title={parking.title}
                location={parking.location}
                price={parking.price}
                availability={parking.availability}
                image={parking.image}
                isActive={activeParkingId === parking.id}
                onClick={() => setActiveParkingId(parking.id)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Right Side: Leaflet Map View (55%) */}
      <div className="w-[55%] h-full relative z-0">
        <MapContainer 
          center={DEFAULT_CENTER} 
          zoom={14} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Map logical updater */}
          <MapFlyToUpdater 
            activeParkingId={activeParkingId} 
            parkings={DUMMY_PARKINGS} 
            markerRefs={markerRefs} 
          />

          {/* Beautiful subtle generic map styling */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render markers perfectly onto the map */}
          {DUMMY_PARKINGS.map((parking) => (
            <Marker 
              key={`marker-${parking.id}`} 
              position={[parking.lat, parking.lng]}
              ref={(ref) => {
                if (ref) markerRefs.current[parking.id] = ref;
              }}
              eventHandlers={{
                click: () => setActiveParkingId(parking.id)
              }}
            >
              <Popup>
                <div className="p-1 min-w-[120px]">
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{parking.title}</h3>
                  <p className="text-sm font-semibold text-[#3b5cf2]">${parking.price} / hr</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
    </div>
  );
}
