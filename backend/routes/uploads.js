const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', uploadImage);
router.delete('/:public_id', deleteImage);

module.exports = router;
