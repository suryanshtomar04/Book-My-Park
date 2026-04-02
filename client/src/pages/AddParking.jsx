import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createParking } from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Viewport fade-in wrapper
const FadeInView = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fix Leaflet default marker icon paths for Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

// Reverse geocode coordinates → readable address using Nominatim
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    if (data && data.display_name) return data.display_name;
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

export default function AddParking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Form state ──
  const [parkingTitle, setParkingTitle] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [description, setDescription] = useState('');

  // ── Map state ──
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');

  // ── Image state ──
  const [image, setImage] = useState(null);

  // ── UI state ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Map click handler component ──
  const LocationMarker = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        const address = await reverseGeocode(lat, lng);
        setLocationAddress(address);
      },
    });
    return selectedLocation ? <Marker position={selectedLocation} icon={customIcon} /> : null;
  };

  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedLocation) {
      setError('Please click on the map to select a parking location.');
      return;
    }
    if (!parkingTitle.trim()) {
      setError('Parking title is required.');
      return;
    }
    if (!pricePerHour || Number(pricePerHour) < 0) {
      setError('Enter a valid price per hour.');
      return;
    }
    if (!totalSlots || Number(totalSlots) < 1) {
      setError('Enter at least 1 parking slot.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: parkingTitle.trim(),
        location: {
          address: locationAddress,
          coordinates: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          },
        },
        pricePerHour: Number(pricePerHour),
        totalSlots: Number(totalSlots),
        availableSlots: Number(totalSlots),
        availability: {
          startTime: '08:00',
          endTime: '22:00',
        },
        ownerId: user?.id || 'dev-admin',
      };

      const fd = new FormData();
      fd.append('title', payload.title);
      fd.append('location', JSON.stringify(payload.location));
      fd.append('pricePerHour', String(payload.pricePerHour));
      fd.append('totalSlots', String(payload.totalSlots));
      fd.append('availableSlots', String(payload.availableSlots));
      fd.append('availability', JSON.stringify(payload.availability));
      fd.append('description', description.trim());
      fd.append('ownerId', payload.ownerId);

      if (image) {
        fd.append('images', image);
      }

      await createParking(fd);
      navigate('/explore');
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to add your parking spot. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const defaultCenter = [28.6139, 77.209];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            List Your Parking Spot
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Pin your location on the map and fill in the details below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[1.5rem] shadow-xl shadow-blue-500/5 border border-gray-100 p-8 sm:p-10"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Step 1 : Map ── */}
            <FadeInView>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="text-gradient font-bold mr-1">1.</span> Select Location on Map
              </label>
              <div className="h-[350px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative" style={{ zIndex: 1 }}>
                <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom className="h-full w-full outline-none">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>

              <motion.div
                animate={selectedLocation ? { borderColor: 'rgba(59, 130, 246, 0.3)' } : {}}
                className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-xl border border-gray-100 transition-all duration-300"
              >
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Selected Address
                </h4>
                <p className="text-sm font-medium text-gray-800">
                  {locationAddress || 'Click anywhere on the map above to select your location'}
                </p>
                {selectedLocation && (
                  <p className="text-xs text-gray-400 mt-1">
                    Coordinates: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                  </p>
                )}
              </motion.div>
            </div>
            </FadeInView>

            {/* ── Step 2 : Details ── */}
            <FadeInView delay={0.1}>
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <span className="text-gradient font-bold mr-1">2.</span> Enter Spot Details
              </label>

              <div className="space-y-6">
                <div>
                  <label htmlFor="parkingTitle" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Parking Title
                  </label>
                  <input
                    type="text"
                    id="parkingTitle"
                    required
                    value={parkingTitle}
                    onChange={(e) => setParkingTitle(e.target.value)}
                    placeholder="e.g. Downtown Premium Garage"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 input-glow"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-600 mb-1.5">
                      Price per Hour (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                      <input
                        type="number"
                        id="pricePerHour"
                        required
                        min="0"
                        step="0.01"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        placeholder="50.00"
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 input-glow"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="totalSlots" className="block text-sm font-medium text-gray-600 mb-1.5">
                      Total Slots
                    </label>
                    <input
                      type="number"
                      id="totalSlots"
                      required
                      min="1"
                      value={totalSlots}
                      onChange={(e) => setTotalSlots(e.target.value)}
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 input-glow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your parking spot, security features, access instructions, etc."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-gray-900 input-glow"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Upload Cover Image (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:bg-blue-50/30 hover:border-blue-300 transition-all duration-300 bg-white group cursor-pointer">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="image" className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-500 transition-colors">
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
                            }}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        {image ? (
                          <span className="text-blue-600 font-medium">{image.name}</span>
                        ) : 'PNG, JPG, GIF up to 5MB'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </FadeInView>

            {/* ── Submit ── */}
            <div className="pt-6 border-t border-gray-100">
              <motion.button
                type="submit"
                disabled={loading || !selectedLocation}
                whileHover={!loading && selectedLocation ? { scale: 1.01 } : {}}
                whileTap={!loading && selectedLocation ? { scale: 0.97 } : {}}
                className={`w-full px-5 py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-200 btn-ripple
                  ${loading || !selectedLocation
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 btn-glow'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'List This Spot'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
