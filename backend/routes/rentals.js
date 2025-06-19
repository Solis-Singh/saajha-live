const express = require('express');
const router = express.Router();
const {
  createRental,
  getMyRentals,
  getMyListingsRentals,
  getRental,
  updateRentalStatus
} = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createRental);
router.get('/my-rentals', getMyRentals);
router.get('/my-listings-rentals', getMyListingsRentals);
router.get('/:id', getRental);
router.put('/:id/status', updateRentalStatus);

module.exports = router;
