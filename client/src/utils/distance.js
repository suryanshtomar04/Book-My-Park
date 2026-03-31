/**
 * Calculates the great-circle distance between two points on the Earth's surface.
 * @param {number} lat1 Latitude of first point
 * @param {number} lon1 Longitude of first point
 * @param {number} lat2 Latitude of second point
 * @param {number} lon2 Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Generates an array of mock parking spots clustered around a given center.
 * Used as a fallback when the real database has no locations near the user.
 */
export function generateMockSpots(centerLat, centerLng, cityName = "Your Area", count = 6) {
  const mockTitles = [
    "Sector 62 Premium Parking",
    "Metro Station Multilevel",
    "DLF Cyber City Valet",
    "Mall Central Parking",
    "IT Park Secure Lot",
    "Railway Station Quick Stop",
    "MG Road Economy Space",
    "Tech Park Reserve",
    "Connaught Place Underground",
    "City Central Garage"
  ];
  const images = [
    "https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573348722427-f1d6819f04ab?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop"
  ];

  const spots = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random offset roughly within 3-4 km radius 
    // 0.01 degrees lat/lng is roughly 1km
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    spots.push({
      _id: `mock-${Date.now()}-${i}`,
      description: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      location: { 
        address: `${cityName} Zone ${String.fromCharCode(65 + i)}`, 
        coordinates: [centerLng + lngOffset, centerLat + latOffset] // GeoJSON format: [lng, lat]
      },
      pricePerHour: Math.floor(Math.random() * 100) + 50, // Between ₹50 and ₹150
      availability: Math.random() > 0.8 ? "full" : "available",
      images: [images[Math.floor(Math.random() * images.length)]]
    });
  }
  
  return spots;
}
