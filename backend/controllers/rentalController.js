const Rental = require('../models/Rental');
const Product = require('../models/Product');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
exports.createRental = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product is available
    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available for rent'
      });
    }
    
    // Check if user is trying to rent their own product
    if (product.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own product'
      });
    }
    
    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * product.pricePerDay;
    
    // Create rental
    const rental = await Rental.create({
      renter: req.user.id,
      product: productId,
      owner: product.owner,
      startDate,
      endDate,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    res.status(201).json({
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

// @desc    Get all rentals for current user (as renter)
// @route   GET /api/rentals/my-rentals
// @access  Private
exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate({
        path: 'product',
        select: 'title images pricePerDay'
      })
      .populate({
        path: 'owner',
        select: 'name'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all rentals for current user (as owner)
// @route   GET /api/rentals/my-listings-rentals
// @access  Private
exports.getMyListingsRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ owner: req.user.id })
      .populate({
        path: 'product',
        select: 'title images pricePerDay'
      })
      .populate({
        path: 'renter',
        select: 'name'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single rental
// @route   GET /api/rentals/:id
// @access  Private
exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate({
        path: 'product',
        select: 'title description images pricePerDay'
      })
      .populate({
        path: 'renter',
        select: 'name email phone'
      })
      .populate({
        path: 'owner',
        select: 'name email phone'
      });
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }
    
    // Make sure user is rental owner or renter
    if (
      rental.renter._id.toString() !== req.user.id &&
      rental.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this rental'
      });
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

// @desc    Update rental status
// @route   PUT /api/rentals/:id/status
// @access  Private
exports.updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    let rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }
    
    // Make sure user is rental owner or admin
    if (rental.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this rental'
      });
    }
    
    // Update product availability if status is cancelled
    if (status === 'cancelled') {
      await Product.findByIdAndUpdate(rental.product, { isAvailable: true });
    }
    
    // Update rental status
    rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
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
