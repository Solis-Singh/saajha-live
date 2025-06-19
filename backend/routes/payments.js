const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  updatePaymentStatus,
  stripeWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Public route for Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/update-payment-status', protect, updatePaymentStatus);

module.exports = router;
