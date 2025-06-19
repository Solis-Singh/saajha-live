const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Rental = require('../models/Rental');
const Product = require('../models/Product');

// @desc    Create payment intent with Stripe
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { rentalId } = req.body;
    
    // Find rental
    const rental = await Rental.findById(rentalId).populate('product');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }
    
    // Check if user is the renter
    if (rental.renter.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to make payment for this rental'
      });
    }
    
    // Check if rental is already paid
    if (rental.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This rental has already been paid for'
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(rental.totalPrice * 100), // Stripe requires amount in cents
      currency: 'usd',
      metadata: {
        rentalId: rental._id.toString(),
        productId: rental.product._id.toString(),
        userId: req.user.id
      }
    });
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update payment status
// @route   POST /api/payments/update-payment-status
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { rentalId, paymentId, paymentStatus } = req.body;
    
    // Find rental
    let rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }
    
    // Check if user is the renter
    if (rental.renter.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update payment for this rental'
      });
    }
    
    // Update rental payment status
    rental = await Rental.findByIdAndUpdate(
      rentalId,
      {
        paymentStatus,
        paymentId,
        status: paymentStatus === 'paid' ? 'confirmed' : rental.status
      },
      { new: true, runValidators: true }
    );
    
    // Update product availability if payment is successful
    if (paymentStatus === 'paid') {
      await Product.findByIdAndUpdate(rental.product, { isAvailable: false });
    }
    
    res.status(200).json({
      success: true,
      rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Webhook for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update rental payment status
    await Rental.findByIdAndUpdate(
      paymentIntent.metadata.rentalId,
      {
        paymentStatus: 'paid',
        paymentId: paymentIntent.id,
        status: 'confirmed'
      }
    );
    
    // Update product availability
    await Product.findByIdAndUpdate(
      paymentIntent.metadata.productId,
      { isAvailable: false }
    );
  }
  
  res.status(200).json({ received: true });
};
