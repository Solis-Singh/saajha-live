import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, rentalsAPI, paymentsAPI } from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_key');

// Checkout form component
const CheckoutForm = ({ rentalId, totalPrice, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create payment intent
      const { data } = await paymentsAPI.createPaymentIntent(rentalId);
      
      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Update payment status
        await paymentsAPI.updatePaymentStatus({
          rentalId,
          paymentId: result.paymentIntent.id,
          paymentStatus: 'paid',
        });
        
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="border border-gray-300 rounded-md p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn-primary"
        >
          {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [rentalId, setRentalId] = useState(null);
  const [rentalSuccess, setRentalSuccess] = useState(false);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await productsAPI.getProduct(id);
        setProduct(response.data.product);
        
        // Set default dates to today and tomorrow
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        setRentalDates({
          startDate: today.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Calculate total price when rental dates change
  useEffect(() => {
    if (product && rentalDates.startDate && rentalDates.endDate) {
      const start = new Date(rentalDates.startDate);
      const end = new Date(rentalDates.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalPrice(diffDays * product.pricePerDay);
    }
  }, [product, rentalDates]);
  
  const handleDateChange = (e) => {
    setRentalDates({
      ...rentalDates,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleRentNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    setShowRentalForm(true);
  };
  
  const handleCreateRental = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate dates
      const start = new Date(rentalDates.startDate);
      const end = new Date(rentalDates.endDate);
      
      if (start >= end) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }
      
      // Create rental
      const response = await rentalsAPI.createRental({
        productId: product._id,
        startDate: rentalDates.startDate,
        endDate: rentalDates.endDate,
      });
      
      setRentalId(response.data.rental._id);
      setShowCheckout(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create rental. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setRentalSuccess(true);
  };
  
  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };
  
  if (loading && !product) {
    return (
      <div className="pt-16 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error && !product) {
    return (
      <div className="pt-16 min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => navigate('/browse')}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go back to browse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return null;
  }
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {rentalSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your rental has been successfully booked! You can view your rental details in your profile.
                </p>
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/my-rentals')}
                      className="text-sm font-medium text-green-700 hover:text-green-600"
                    >
                      View My Rentals
                    </button>
                    <button
                      onClick={() => navigate('/browse')}
                      className="text-sm font-medium text-green-700 hover:text-green-600"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
                Home
              </button>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <button onClick={() => navigate('/browse')} className="text-gray-500 hover:text-gray-700">
                Browse
              </button>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700">{product.title}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product images */}
            <div>
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg mb-4">
                <img
                  src={product.images[activeImage]?.url || 'https://via.placeholder.com/600x400?text=No+Image'}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-md ${
                        activeImage === index ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {product.category}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.condition}
                </span>
              </div>
              
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary-600">₹{product.pricePerDay}</span>
                <span className="text-gray-500 ml-1">/ day</span>
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Location</h2>
                <p className="mt-2 flex items-center text-gray-600">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {product.location}
                </p>
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Owner</h2>
                <div className="mt-2 flex items-center">
                  <img
                    src={product.owner?.avatar || 'https://via.placeholder.com/40?text=User'}
                    alt={product.owner?.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.owner?.name}</p>
                  </div>
                </div>
              </div>
              
              {/* Rental form or button */}
              {!rentalSuccess && (
                <div className="mt-8">
                  {!showRentalForm ? (
                    <button
                      onClick={handleRentNow}
                      disabled={!product.isAvailable || (user && product.owner?._id === user._id)}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!product.isAvailable
                        ? 'Currently Unavailable'
                        : user && product.owner?._id === user._id
                        ? 'You Own This Product'
                        : 'Rent Now'}
                    </button>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Book Your Rental</h3>
                      
                      {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}
                      
                      {!showCheckout ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={rentalDates.startDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={rentalDates.endDate}
                                onChange={handleDateChange}
                                min={rentalDates.startDate}
                                className="input-field"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price per day:</span>
                              <span className="font-medium">₹{product.pricePerDay.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-600">Number of days:</span>
                              <span className="font-medium">
                                {rentalDates.startDate && rentalDates.endDate
                                  ? Math.ceil(
                                      (new Date(rentalDates.endDate) - new Date(rentalDates.startDate)) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  : 0}
                              </span>
                            </div>
                            <div className="flex justify-between mt-2 text-lg font-bold">
                              <span>Total:</span>
                              <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <button
                              onClick={() => setShowRentalForm(false)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCreateRental}
                              disabled={loading}
                              className="btn-primary"
                            >
                              {loading ? 'Processing...' : 'Continue to Payment'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Elements stripe={stripePromise}>
                          <CheckoutForm
                            rentalId={rentalId}
                            totalPrice={totalPrice}
                            onSuccess={handlePaymentSuccess}
                            onCancel={handlePaymentCancel}
                          />
                        </Elements>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
