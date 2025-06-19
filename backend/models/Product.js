const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Electronics', 'Books', 'Cycles', 'Gadgets', 'Furniture', 'Clothing', 'Sports', 'Tools', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please provide a daily rental price'],
    min: [1, 'Price must be at least 1']
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      public_id: String
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for rentals associated with this product
ProductSchema.virtual('rentals', {
  ref: 'Rental',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

module.exports = mongoose.model('Product', ProductSchema);
