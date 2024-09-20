const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { adminAuth } = require('../middlewares/auth');
const multer = require('multer');

// Configure Multer for image uploads
const storage = multer.memoryStorage(); // Or use multer-s3 for AWS S3
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', adminAuth, upload.array('images', 5), addProduct);
router.put('/:id', adminAuth, upload.array('images', 5), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
