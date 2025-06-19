import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rentalsAPI, paymentsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const RentalDetails = () => {
  const { rentalId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/rentals/${rentalId}` } });
    }
  }, [user, navigate, rentalId]);
  
  // Fetch rental details
  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await rentalsAPI.getRentalById(rentalId);
        setRental(response.data.rental);
      } catch (error) {
        console.error('Error fetching rental details:', error);
        setError('Failed to load rental details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && rentalId) {
      fetchRentalDetails();
    }
  }, [user, rentalId]);
  
  const handleUpdateStatus = async (status) => {
    try {
      setActionLoading(true);
      await rentalsAPI.updateRentalStatus(rentalId, status);
      
      // Update local state
      setRental(prev => ({ ...prev, status }));
      
      setAlert({
        show: true,
        type: 'success',
        message: `Rental status updated to ${status} successfully!`
      });
    } catch (error) {
      console.error('Error updating rental status:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update rental status. Please try again.'
      });
    } finally {
      setActionLoading(false);
    }
  };
  
  const handlePayment = async () => {
    try {
      setActionLoading(true);
      
      // Create payment intent
      const response = await paymentsAPI.createPaymentIntent({
        rentalId: rental._id,
        amount: rental.totalPrice * 100 // Convert to cents for Stripe
      });
      
      // Redirect to payment page
      navigate(`/payment/${rental._id}`, {
        state: { clientSecret: response.data.clientSecret }
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to initiate payment. Please try again.'
      });
      setActionLoading(false);
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
      <div className="pt-16 min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert type="error" message={error} />
          <div className="mt-4">
            <Link to="/my-rentals" className="btn-primary">
              Back to My Rentals
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!rental) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Rental Not Found</h2>
            <p className="mt-2 text-gray-600">The rental you're looking for doesn't exist or you don't have permission to view it.</p>
            <div className="mt-6">
              <Link to="/my-rentals" className="btn-primary">
                Back to My Rentals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const isRenter = user?._id === rental.renter?._id;
  const isOwner = user?._id === rental.owner?._id;
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Rental Details</h1>
          <Link to="/my-rentals" className="text-primary-600 hover:text-primary-800 font-medium">
            Back to My Rentals
          </Link>
        </div>
        
        {alert.show && (
          <div className="mt-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}
        
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Rental #{rental._id.substring(rental._id.length - 8)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Created on {new Date(rental.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(rental.status)}`}>
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </span>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(rental.paymentStatus)}`}>
                Payment: {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0 h-20 w-20">
                    <img
                      className="h-20 w-20 rounded-md object-cover"
                      src={rental.product?.images[0]?.url || 'https://via.placeholder.com/80?text=No+Image'}
                      alt={rental.product?.title}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      <Link to={`/products/${rental.product?._id}`} className="hover:text-primary-600">
                        {rental.product?.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {rental.product?.description?.substring(0, 100)}
                      {rental.product?.description?.length > 100 ? '...' : ''}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                        {rental.product?.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {rental.product?.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rental Period</h3>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-base font-medium text-gray-900">{formatDate(rental.startDate)}</p>
                  </div>
                  <div className="text-gray-400">to</div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="text-base font-medium text-gray-900">{formatDate(rental.endDate)}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Duration: {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <div className="mt-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Price per day</p>
                    <p className="text-sm font-medium text-gray-900">${rental.product?.pricePerDay.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">Number of days</p>
                    <p className="text-sm font-medium text-gray-900">
                      {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">Service fee</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${(rental.totalPrice * 0.1).toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-bold text-gray-900">${rental.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Renter</h4>
                      <p className="mt-1 text-sm text-gray-900">{rental.renter?.name}</p>
                      <p className="text-sm text-gray-900">{rental.renter?.email}</p>
                      {rental.renter?.phone && <p className="text-sm text-gray-900">{rental.renter.phone}</p>}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Owner</h4>
                      <p className="mt-1 text-sm text-gray-900">{rental.owner?.name}</p>
                      <p className="text-sm text-gray-900">{rental.owner?.email}</p>
                      {rental.owner?.phone && <p className="text-sm text-gray-900">{rental.owner.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between items-center">
            {isRenter && (
              <div className="flex space-x-3">
                {rental.paymentStatus === 'pending' && (
                  <button
                    onClick={handlePayment}
                    disabled={actionLoading}
                    className="btn-primary"
                  >
                    {actionLoading ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
                
                {(rental.status === 'pending' || rental.status === 'confirmed') && (
                  <button
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={actionLoading}
                    className="btn-secondary"
                  >
                    {actionLoading ? 'Processing...' : 'Cancel Rental'}
                  </button>
                )}
              </div>
            )}
            
            {isOwner && (
              <div className="flex space-x-3">
                {rental.status === 'pending' && rental.paymentStatus === 'paid' && (
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={actionLoading}
                    className="btn-primary"
                  >
                    {actionLoading ? 'Processing...' : 'Confirm Rental'}
                  </button>
                )}
                
                {rental.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus('active')}
                    disabled={actionLoading}
                    className="btn-primary"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Active'}
                  </button>
                )}
                
                {rental.status === 'active' && (
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={actionLoading}
                    className="btn-primary"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Completed'}
                  </button>
                )}
                
                {(rental.status === 'pending' || rental.status === 'confirmed') && (
                  <button
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={actionLoading}
                    className="btn-secondary"
                  >
                    {actionLoading ? 'Processing...' : 'Cancel Rental'}
                  </button>
                )}
              </div>
            )}
            
            <Link
              to={`/products/${rental.product?._id}`}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
