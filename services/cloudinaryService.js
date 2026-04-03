const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Upload a single buffer to Cloudinary and return the result.
 * @param {Buffer} fileBuffer  — the file buffer from multer memoryStorage
 * @param {string} folder      — Cloudinary folder name
 * @returns {Promise<Object>}  — { url, public_id }
 */
const uploadToCloudinary = (fileBuffer, folder = "car_parking") => {
  return new Promise((resolve, reject) => {
    // BYPASS: If API key is missing or is the placeholder, return a default image
    const config = cloudinary.config();
    if (!config.api_key || config.api_key === 'your_api_key') {
      console.warn("Cloudinary API key is missing or is placeholder. Bypassing upload and using a placeholder image.");
      return resolve({
        url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1000&auto=format&fit=crop", // generic parking image
        public_id: "placeholder_" + Date.now(),
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" },      // cap max width
          { quality: "auto", fetch_format: "auto" }, // auto-optimize
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Upload multiple buffers in parallel.
 * @param {Array<Buffer>} fileBuffers
 * @param {string} folder
 * @returns {Promise<Array<{ url, public_id }>>}
 */
const uploadMultiple = async (fileBuffers, folder = "car_parking") => {
  const promises = fileBuffers.map((buf) => uploadToCloudinary(buf, folder));
  return Promise.all(promises);
};

/**
 * Delete an image from Cloudinary by public_id.
 */
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, uploadMultiple, deleteFromCloudinary };
