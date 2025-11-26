const Product = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

const createProduct = async (req, res) => {
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can create products' });
    try {
        const product = await Product.create({ ...req.body, seller: req.user._id });
        res.status(201).json(product);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (req.user.role !== 'seller' || !product.seller.equals(req.user._id))
            return res.status(403).json({ error: 'Not authorized' });

        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (req.user.role !== 'seller' || !product.seller.equals(req.user._id))
            return res.status(403).json({ error: 'Not authorized' });

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};