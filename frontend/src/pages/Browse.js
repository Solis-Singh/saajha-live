import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { productsAPI } from '../utils/api';

const Browse = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    location: '',
    condition: '',
    sort: 'createdAt',
    sortDirection: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });

  const location = useLocation();

  // Extract category from URL query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [location.search]);

  // Fetch products based on filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        // Build query params
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit,
          sort: `${filters.sortDirection === 'desc' ? '-' : ''}${filters.sort}`,
        };

        // Add filters if they exist
        if (filters.category) queryParams.category = filters.category;
        if (filters.priceMin) queryParams.pricePerDay = { $gte: filters.priceMin };
        if (filters.priceMax) queryParams.pricePerDay = { ...queryParams.pricePerDay, $lte: filters.priceMax };
        if (filters.location) queryParams.location = filters.location;
        if (filters.condition) queryParams.condition = filters.condition;

        const response = await productsAPI.getAllProducts(queryParams);
        setProducts(response.data.products);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'price-asc') {
      setFilters(prev => ({ ...prev, sort: 'pricePerDay', sortDirection: 'asc' }));
    } else if (value === 'price-desc') {
      setFilters(prev => ({ ...prev, sort: 'pricePerDay', sortDirection: 'desc' }));
    } else if (value === 'newest') {
      setFilters(prev => ({ ...prev, sort: 'createdAt', sortDirection: 'desc' }));
    } else if (value === 'oldest') {
      setFilters(prev => ({ ...prev, sort: 'createdAt', sortDirection: 'asc' }));
    }
    // Reset to page 1 when sort changes
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
      setPagination(prev => ({ ...prev, page: newPage }));
      // Scroll to top when page changes
      window.scrollTo(0, 0);
    }
  };

  const categories = [
    'All Categories',
    'Electronics',
    'Books',
    'Agriculture Tools',
    'Other',
  ];

  const conditions = ['All Conditions', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,theme(colors.violet.800/5%),theme(colors.fuchsia.800/5%),theme(colors.violet.800/5%))] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/1%),transparent_70%)] backdrop-blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">Browse Products</h1>
        <p className="mt-2 text-lg text-violet-300/90">Find the perfect item to rent</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="col-span-1 bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-violet-900/20 border border-violet-800/20">
            <h2 className="text-xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text mb-6">Filters</h2>

            <div className="space-y-6">
              {/* Category filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-violet-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-white/10 border border-violet-800/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-900 text-white">All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category} className="bg-gray-900 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range filter */}
              <div>
                <label className="block text-sm font-medium text-violet-300 mb-2">
                  Price Range (per day)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      name="priceMin"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={handleFilterChange}
                      min="0"
                      className="w-full bg-white/10 border border-violet-800/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-violet-400/50"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="priceMax"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={handleFilterChange}
                      min="0"
                      className="w-full bg-white/10 border border-violet-800/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-violet-400/50"
                    />
                  </div>
                </div>
              </div>

              {/* Condition filter */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-violet-300 mb-2">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  className="w-full bg-white/10 border border-violet-800/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-900 text-white">All Conditions</option>
                  {conditions.slice(1).map((condition) => (
                    <option key={condition} value={condition} className="bg-gray-900 text-white">
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location filter */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-violet-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City or Zip code"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full bg-white/10 border border-violet-800/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-violet-400/50"
                />
              </div>

              {/* Reset filters button */}
              <button
                onClick={() =>
                  setFilters({
                    category: '',
                    priceMin: '',
                    priceMax: '',
                    location: '',
                    condition: '',
                    sort: 'createdAt',
                    sortDirection: 'desc',
                  })
                }
                className="w-full py-3 px-4 mt-2 border border-violet-500/50 rounded-lg text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:border-violet-400/70 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-violet-900"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div className="col-span-1 md:col-span-3">
            {/* Sort options */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/5 backdrop-blur-sm p-4 rounded-xl shadow-lg shadow-violet-900/20 border border-violet-800/20">
              <p className="text-sm text-violet-300/90 mb-3 sm:mb-0">
                Showing {products.length} of {pagination.total} products
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-violet-300 mr-3">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={
                    filters.sort === 'pricePerDay'
                      ? filters.sortDirection === 'asc'
                        ? 'price-asc'
                        : 'price-desc'
                      : filters.sortDirection === 'asc'
                      ? 'oldest'
                      : 'newest'
                  }
                  onChange={handleSortChange}
                  className="bg-white/10 border border-violet-800/50 text-white rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="newest" className="bg-gray-900 text-white">Newest</option>
                  <option value="oldest" className="bg-gray-900 text-white">Oldest</option>
                  <option value="price-asc" className="bg-gray-900 text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-gray-900 text-white">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-400"></div>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No products found */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-violet-900/20 border border-violet-800/20 text-center">
                <svg className="mx-auto h-16 w-16 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">No products found</h3>
                <p className="mt-2 text-violet-300/90">Try adjusting your filters or search for something else.</p>
              </div>
            )}

            {/* Products grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product._id} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden transform transition-transform hover:scale-[1.02] duration-300 shadow-lg shadow-violet-900/20 border border-violet-800/20">
                    <div className="relative overflow-hidden group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                      <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.title}
                        className="relative w-full h-48 object-cover rounded-t-lg transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-violet-800">
                        {product.condition}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-white line-clamp-1">{product.title}</h3>
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">₹{product.pricePerDay}/day</span>
                      </div>
                      <p className="mt-1 text-violet-300/90 text-sm line-clamp-2">{product.description}</p>
                      <div className="mt-2 flex items-center text-sm text-violet-300/90">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-violet-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {product.location}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-800/50 text-violet-200">
                          {product.category}
                        </span>
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                        >
                          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                          <span className="relative">View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.total > pagination.limit && (
              <div className="mt-12 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-lg overflow-hidden shadow-lg shadow-violet-900/20 border border-violet-800/20 bg-white/5 backdrop-blur-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-3 py-2 border-r border-violet-800/30 text-sm font-medium text-violet-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                    // Calculate page number to display
                    let pageNum;
                    const totalPages = Math.ceil(pagination.total / pagination.limit);
                    
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      // If current page is 1, 2, or 3, show pages 1-5
                      pageNum = i + 1;
                    } else if (pagination.page >= totalPages - 2) {
                      // If current page is near the end, show last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Otherwise show current page and 2 before and after
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border-r border-violet-800/30 text-sm font-medium transition-colors duration-200 ${
                          pagination.page === pageNum
                            ? 'bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 text-white'
                            : 'text-violet-300 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-violet-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
