import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function useLocation() {
  return useContext(LocationContext);
}

// Default fallback to a central location in India (e.g., New Delhi) if nothing works
const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.2090,
  address: "New Delhi, India"
};

export function LocationProvider({ children }) {
  const [locationState, setLocationState] = useState({
    lat: null,
    lng: null,
    address: null,
    loading: true,
    error: null,
    isManual: false
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'BookMyPark/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API rate limit or server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract a readable city/area name
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown Area";
      const state = data.address?.state || "India";
      return `${city}, ${state}`;
    } catch (err) {
      console.error("Reverse geocoding failed", err);
      return DEFAULT_LOCATION.address;
    }
  };

  const geocodeAddress = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'BookMyPark/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API rate limit or server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name.split(',').slice(0, 2).join(',') // Get just the first two parts
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding failed", err);
      return null;
    }
  };

  const fetchUserLocation = () => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocationState({
        ...DEFAULT_LOCATION,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        isManual: true
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const address = await reverseGeocode(lat, lng);
        
        setLocationState({
          lat,
          lng,
          address,
          loading: false,
          error: null,
          isManual: false
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        // On permission denied or other errors, use the default fallback
        setLocationState({
          ...DEFAULT_LOCATION,
          loading: false,
          error: error.message,
          isManual: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Attempt to fetch upon context initialization
  useEffect(() => {
    fetchUserLocation();
  }, []);

  const setManualLocation = async (query) => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));
    const result = await geocodeAddress(query);
    
    if (result) {
      setLocationState({
        lat: result.lat,
        lng: result.lng,
        address: result.address,
        loading: false,
        error: null,
        isManual: true
      });
      return true;
    } else {
      setLocationState(prev => ({ ...prev, loading: false, error: 'Location not found' }));
      return false;
    }
  };

  return (
    <LocationContext.Provider value={{
      ...locationState,
      fetchUserLocation,
      setManualLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}
