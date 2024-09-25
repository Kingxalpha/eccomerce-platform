const express = require('express');
const productRouter = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct, addRating } = require('../controllers/ProductCtrl');
const { auth, adminAuth } = require('../middlewares/protectedRoute');

productRouter.get('/', auth, getProducts);
productRouter.get('/:id', auth, getProductById);
productRouter.post('/create', auth, addProduct);
productRouter.put('/:id', auth, updateProduct);
productRouter.delete('/:id', adminAuth, deleteProduct);
productRouter.post('/:productId/rate', auth , addRating)

module.exports = productRouter;