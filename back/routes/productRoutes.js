const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Public
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

module.exports = router;
