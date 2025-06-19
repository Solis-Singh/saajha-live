import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, uploadsAPI } from '../utils/api';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    pricePerDay: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if not logged in
  if (!user) {
    navigate('/login', { state: { from: '/add-product' } });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pricePerDay' ? parseFloat(value) || '' : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    
    setImageFiles([...imageFiles, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);
    
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedImages = [];
    let progress = 0;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const formData = new FormData();
      formData.append('image', imageFiles[i]);
      
      try {
        const response = await uploadsAPI.uploadImage(formData);
        uploadedImages.push({
          url: response.data.url,
          public_id: response.data.public_id,
        });
        
        // Update progress
        progress = Math.round(((i + 1) / imageFiles.length) * 100);
        setUploadProgress(progress);
      } catch (error) {
        throw new Error(`Failed to upload image ${i + 1}`);
      }
    }
    
    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || 
        !formData.condition || !formData.pricePerDay || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (imageFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Upload images first
      setUploadProgress(1); // Start progress
      const uploadedImages = await uploadImages();
      
      // Create product with uploaded images
      const productData = {
        ...formData,
        images: uploadedImages,
      };
      
      await productsAPI.createProduct(productData);
      
      // Redirect to user products page
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const categories = [
    'Electronics',
    'Books',
    'Agriculture Tools',
    'Other',
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,theme(colors.violet.800/5%),theme(colors.fuchsia.800/5%),theme(colors.violet.800/5%))] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/1%),transparent_70%)] backdrop-blur-xl"></div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-3xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">Add a Product for Rent</h1>
        <p className="mt-2 text-lg text-violet-300/90">
          Share your items with others and earn money when they're not in use
        </p>

        {error && (
          <div className="mt-4 bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl border border-violet-800/20 shadow-lg shadow-violet-900/20 p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-violet-300">
                Title <span className="text-red-400">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-violet-300">
                Description <span className="text-red-400">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-violet-400/80">
                Provide details about your product, its features, and any usage instructions.
              </p>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-violet-300">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-gray-900 text-white">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-gray-900 text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-violet-300">
                  Condition <span className="text-red-400">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-gray-900 text-white">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition} className="bg-gray-900 text-white">
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerDay" className="block text-sm font-medium text-violet-300">
                  Price per day (₹) <span className="text-red-400">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="pricePerDay"
                    name="pricePerDay"
                    min="1"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-violet-300">
                  Location <span className="text-red-400">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full bg-white/10 border border-violet-800/30 rounded-lg px-4 py-2 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-violet-300">
                Product Images <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-violet-800/30 border-dashed rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-violet-600/50 group">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-violet-400 group-hover:text-violet-300 transition-colors duration-300"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-violet-300 justify-center">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-violet-600/30 rounded-md font-medium text-violet-200 hover:text-white px-3 py-1 transition-all duration-300 hover:bg-violet-600/50 focus-within:outline-none"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1 self-center">or drag and drop</p>
                  </div>
                  <p className="text-xs text-violet-400/80">PNG, JPG, GIF up to 5MB (max 5 images)</p>
                </div>
              </div>

              {/* Image previews */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative group overflow-hidden">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="relative h-24 w-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-1 shadow-lg transform transition-transform duration-300 hover:scale-110"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload progress */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-violet-200">
                        Uploading Images
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-lg bg-white/10 backdrop-blur-sm">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-all duration-300"
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={() => navigate('/browse')}
                className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-white/10 backdrop-blur-sm border border-violet-500/50 rounded-lg hover:bg-white/15 transition-all duration-300 hover:border-violet-400/70 transform hover:scale-[1.02] mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center gap-2">
                  {loading ? 'Creating Product...' : 'Create Product'}
                  {!loading && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
