const Order = require('../models/orderModel');

const canModify = (user, order) => user.role === 'admin' || order.client.equals(user._id);

// Create Order 
const createOrder = async (req, res) => {
    if (req.user.role !== 'client') return res.status(403).json({ error: 'Only clients can create orders' });

    try {
        const { products, total_points } = req.body;
        const order = await Order.create({
            client: req.user._id,
            products,
            total_points
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Get all orders
const getOrders = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { client: req.user._id };
        const orders = await Order.find(filter).populate('client', 'name email').populate('products.product', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('client', 'name email').populate('products.product', 'name price');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (!canModify(req.user, order)) return res.status(403).json({ error: 'Not authorized' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update order (client only)
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (!canModify(req.user, order)) return res.status(403).json({ error: 'Not authorized' });

        Object.assign(order, req.body);
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete order (client only, admin optional)
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (!canModify(req.user, order)) return res.status(403).json({ error: 'Not authorized' });

        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { createOrder, getOrders, getOrder, updateOrder, deleteOrder };
