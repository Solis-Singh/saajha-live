import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rentalsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const MyRentals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('rented');
  const [rentedItems, setRentedItems] = useState([]);
  const [listedRentals, setListedRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-rentals' } });
    }
  }, [user, navigate]);
  
  // Fetch user rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch items user has rented
        const rentedResponse = await rentalsAPI.getUserRentals();
        setRentedItems(rentedResponse.data.rentals);
        
        // Fetch rentals for user's listings
        const listedResponse = await rentalsAPI.getUserListingsRentals();
        setListedRentals(listedResponse.data.rentals);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        setError('Failed to load rentals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchRentals();
    }
  }, [user]);
  
  const handleUpdateStatus = async (rentalId, status) => {
    try {
      await rentalsAPI.updateRentalStatus(rentalId, status);
      
      // Update local state
      setListedRentals(prevRentals =>
        prevRentals.map(rental =>
          rental._id === rentalId ? { ...rental, status } : rental
        )
      );
    } catch (error) {
      console.error('Error updating rental status:', error);
      setError('Failed to update rental status. Please try again.');
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-400"></div>
      </div>
    );
  }
  
  return (
    <div className="pt-2 mt-5 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,theme(colors.violet.800/5%),theme(colors.fuchsia.800/5%),theme(colors.violet.800/5%))] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/1%),transparent_70%)] backdrop-blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <h1 className="text-3xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">My Rentals</h1>
        
        {error && (
          <div className="mt-4">
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}
        
        <div className="mt-8">
          <div className="border-b border-violet-800/30">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('rented')}
                className={`${
                  activeTab === 'rented'
                    ? 'border-fuchsia-500 text-fuchsia-400'
                    : 'border-transparent text-violet-300/90 hover:text-white hover:border-violet-400/50'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base transition-all duration-300`}
              >
                Items I've Rented ({rentedItems.length})
              </button>
              <button
                onClick={() => setActiveTab('listed')}
                className={`${
                  activeTab === 'listed'
                    ? 'border-fuchsia-500 text-fuchsia-400'
                    : 'border-transparent text-violet-300/90 hover:text-white hover:border-violet-400/50'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base transition-all duration-300`}
              >
                Rentals of My Listings ({listedRentals.length})
              </button>
            </nav>
          </div>
          
          <div className="mt-8">
            {activeTab === 'rented' ? (
              <div>
                {rentedItems.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-300 shadow-lg shadow-violet-900/20 border border-violet-800/20">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center mb-6">
                      <svg className="h-10 w-10 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-xl font-medium text-white font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">No Rentals Yet</h3>
                    <p className="mt-4 text-violet-300/90 max-w-md mx-auto">
                      You haven't rented any items yet. Start browsing to find what you need.
                    </p>
                    <div className="mt-8">
                      <Link 
                        to="/browse" 
                        className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                      >
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative flex items-center gap-2">
                          Browse Products
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Rental Period
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Payment
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-violet-800/20">
                        {rentedItems.map((rental) => (
                          <tr key={rental._id} className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 relative group">
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                  <img
                                    className="relative h-12 w-12 rounded-md object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    src={rental.product?.images[0]?.url || 'https://via.placeholder.com/40?text=No+Image'}
                                    alt={rental.product?.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    <Link to={`/products/${rental.product?._id}`} className="hover:text-fuchsia-400 transition-colors duration-200">
                                      {rental.product?.title}
                                    </Link>
                                  </div>
                                  <div className="text-sm text-violet-300/90">
                                    Owner: {rental.owner?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </div>
                              <div className="text-sm text-violet-300/90">
                                {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">${rental.totalPrice.toFixed(2)}</div>
                              <div className="text-sm text-violet-300/90">
                                ${rental.product?.pricePerDay}/day
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(rental.status)}`}>
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(rental.paymentStatus)}`}>
                                {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link 
                                to={`/rentals/${rental._id}`} 
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                              >
                                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                                <span className="relative">View Details</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {listedRentals.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-300 shadow-lg shadow-violet-900/20 border border-violet-800/20">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center mb-6">
                      <svg className="h-10 w-10 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-xl font-medium text-white font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">No Rentals For Your Listings</h3>
                    <p className="mt-4 text-violet-300/90 max-w-md mx-auto">
                      None of your items have been rented yet. Add more products to increase your chances.
                    </p>
                    <div className="mt-8">
                      <Link 
                        to="/add-product" 
                        className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                      >
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative flex items-center gap-2">
                          Add a Product
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Renter
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Rental Period
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                            Payment
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-violet-800/20">
                        {listedRentals.map((rental) => (
                          <tr key={rental._id} className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 relative group">
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                  <img
                                    className="relative h-12 w-12 rounded-md object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    src={rental.product?.images[0]?.url || 'https://via.placeholder.com/40?text=No+Image'}
                                    alt={rental.product?.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    <Link to={`/products/${rental.product?._id}`} className="hover:text-fuchsia-400 transition-colors duration-200">
                                      {rental.product?.title}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                {rental.renter?.name}
                              </div>
                              <div className="text-sm text-violet-300/90">
                                {rental.renter?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </div>
                              <div className="text-sm text-violet-300/90">
                                {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">${rental.totalPrice.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(rental.status)}`}>
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(rental.paymentStatus)}`}>
                                {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex flex-col space-y-2">
                                <Link 
                                  to={`/rentals/${rental._id}`} 
                                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                                >
                                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                                  <span className="relative">View Details</span>
                                </Link>
                                
                                {rental.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateStatus(rental._id, 'active')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600/30 hover:bg-green-600/50 rounded-lg transition-all duration-300 border border-green-500/50"
                                  >
                                    Mark as Active
                                  </button>
                                )}
                                
                                {rental.status === 'active' && (
                                  <button
                                    onClick={() => handleUpdateStatus(rental._id, 'completed')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600/30 hover:bg-blue-600/50 rounded-lg transition-all duration-300 border border-blue-500/50"
                                  >
                                    Mark as Completed
                                  </button>
                                )}
                                
                                {(rental.status === 'pending' || rental.status === 'confirmed') && (
                                  <button
                                    onClick={() => handleUpdateStatus(rental._id, 'cancelled')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-all duration-300 border border-red-500/50"
                                  >
                                    Cancel Rental
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;
