import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createParking } from '../services/api';

export default function AddParking() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    pricePerHour: '',
    totalSlots: '',
    description: '',
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated or not owner
  // The backend might enforce "owner" role. We check if they're logged in here.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-gray-500">You must be logged in as an owner to add parking spots.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = new FormData();
      
      // Since the backend doesn't explicitly store Title and Total Slots,
      // we gracefully merge them into the description so data isn't lost.
      const formattedDescription = `Title: ${formData.title}\nTotal Slots: ${formData.totalSlots}\n\n${formData.description}`;
      
      // Hardcode some safe default coordinates since we don't have a map picker
      // The backend requires valid coordinates [-180 to 180, -90 to 90]
      const locationObj = {
        type: 'Point',
        coordinates: [-122.4194, 37.7749], // e.g. San Francisco
        address: formData.location
      };
      
      const availabilityObj = {
        startTime: '00:00',
        endTime: '23:59'
      };

      payload.append('location', JSON.stringify(locationObj));
      payload.append('availability', JSON.stringify(availabilityObj));
      payload.append('pricePerHour', formData.pricePerHour);
      payload.append('description', formattedDescription);
      
      if (image) {
        payload.append('images', image);
      }

      await createParking(payload);
      
      // On success, redirect to explore or dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add your parking spot. Make sure you are registered as an Owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            List Your Parking Spot
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Fill out the details below to add your space to our network.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Parking Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Downtown Premium Garage"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Location Address
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Main St, City Center"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price per Hour (₹)
                </label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="5.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="totalSlots" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Total Slots
                </label>
                <input
                  type="number"
                  id="totalSlots"
                  name="totalSlots"
                  required
                  min="1"
                  value={formData.totalSlots}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your parking spot, security features, access instructions, etc."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Upload Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {image ? image.name : 'PNG, JPG, GIF up to 5MB'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-colors shadow-sm
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A2332] hover:bg-black'}`}
              >
                {loading ? 'Submitting...' : 'Add Parking Spot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
