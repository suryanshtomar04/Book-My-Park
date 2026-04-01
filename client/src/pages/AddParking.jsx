import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createParking } from '../services/api';

export default function AddParking() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isInitialized } = useAuth();

  const [formData, setFormData] = useState({
    parkingTitle: '',
    locationAddress: '',
    pricePerHour: '',
    totalSlots: '',
    description: '',
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Authentication is fully handled by upstream AdminRoute wrapper.

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
      const payload = {
        title: formData.parkingTitle,
        location: formData.locationAddress,
        price: Number(formData.pricePerHour),
        totalSlots: Number(formData.totalSlots),
        availableSlots: Number(formData.totalSlots),
        ownerId: user?.id || "dev-admin"
      };

      console.log("PAYLOAD:", payload);
      await createParking(payload);
      
      // On success, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add your parking spot. Make sure you are registered as an Owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 text-gray-900">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            List Your Parking Spot
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Fill out the details below to add your space to our network.
          </p>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-blue-500/5 border border-gray-100 p-8 sm:p-10">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="parkingTitle" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Parking Title
              </label>
              <input
                type="text"
                id="parkingTitle"
                name="parkingTitle"
                required
                value={formData.parkingTitle}
                onChange={handleChange}
                placeholder="e.g. Downtown Premium Garage"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="locationAddress" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Location Address
              </label>
              <input
                type="text"
                id="locationAddress"
                name="locationAddress"
                required
                value={formData.locationAddress}
                onChange={handleChange}
                placeholder="Sector 62, City Center"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price per Hour (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    id="pricePerHour"
                    name="pricePerHour"
                    required
                    min="0"
                    step="0.01"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="50.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>
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
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900"
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Upload Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:bg-gray-50 transition-colors bg-white group cursor-pointer">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="image" className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-500 transition-colors">
                      <span>Upload a file</span>
                      <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">
                    {image ? image.name : 'PNG, JPG, GIF up to 5MB'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-5 py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-200 shadow-md shadow-blue-100
                  ${loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-95'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'List This Spot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
