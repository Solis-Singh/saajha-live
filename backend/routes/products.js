const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getUserProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('https://saajha-frontend.onrender.com/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/user/listings', protect, getUserProducts);

module.exports = router;
