import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rentalsAPI, paymentsAPI } from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

// Load Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ rental, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: rental.renter.name,
            email: rental.renter.email,
          },
        },
      });
      
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful, update rental payment status
        await paymentsAPI.updatePaymentStatus(rental._id, {
          paymentStatus: 'paid',
          paymentIntentId: result.paymentIntent.id,
        });
        
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 border border-gray-200 rounded-md">
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
      
      {error && (
        <Alert type="error" message={error} />
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : `Pay $${rental.totalPrice.toFixed(2)}`}
      </button>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>Test Card: 4242 4242 4242 4242</p>
        <p>Exp: Any future date (MM/YY) | CVC: Any 3 digits | ZIP: Any 5 digits</p>
      </div>
    </form>
  );
};

const Payment = () => {
  const { rentalId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [rental, setRental] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/payment/${rentalId}` } });
    }
  }, [user, navigate, rentalId]);
  
  // Get client secret from location state or create new payment intent
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch rental details
        const rentalResponse = await rentalsAPI.getRentalById(rentalId);
        const rentalData = rentalResponse.data.rental;
        setRental(rentalData);
        
        // Check if user is the renter
        if (user._id !== rentalData.renter._id) {
          navigate('/my-rentals');
          return;
        }
        
        // Check if payment is already completed
        if (rentalData.paymentStatus === 'paid') {
          setPaymentSuccess(true);
          setLoading(false);
          return;
        }
        
        // Get client secret from location state or create new payment intent
        let secret = location.state?.clientSecret;
        
        if (!secret) {
          const paymentResponse = await paymentsAPI.createPaymentIntent({
            rentalId,
            amount: rentalData.totalPrice * 100, // Convert to cents for Stripe
          });
          secret = paymentResponse.data.clientSecret;
        }
        
        setClientSecret(secret);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Failed to load payment information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && rentalId) {
      fetchData();
    }
  }, [user, rentalId, location.state, navigate]);
  
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
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
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert type="error" message={error} />
          <div className="mt-4">
            <button
              onClick={() => navigate('/my-rentals')}
              className="btn-primary w-full"
            >
              Back to My Rentals
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (paymentSuccess) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your payment has been processed successfully. The owner will be notified about your rental.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate(`/rentals/${rentalId}`)}
                className="btn-primary w-full"
              >
                View Rental Details
              </button>
              <button
                onClick={() => navigate('/my-rentals')}
                className="btn-secondary w-full mt-3"
              >
                Go to My Rentals
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>
        
        {rental && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Rental Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <img
                    className="h-16 w-16 rounded-md object-cover"
                    src={rental.product?.images[0]?.url || 'https://via.placeholder.com/64?text=No+Image'}
                    alt={rental.product?.title}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-900">{rental.product?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">Price per day</p>
                  <p className="text-sm font-medium text-gray-900">${rental.product?.pricePerDay.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">Number of days</p>
                  <p className="text-sm font-medium text-gray-900">
                    {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">Service fee</p>
                  <p className="text-sm font-medium text-gray-900">${(rental.totalPrice * 0.1).toFixed(2)}</p>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">${rental.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              rental={rental}
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
