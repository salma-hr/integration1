const Transaction = require('../models/transactionModel');

//check if user can access transaction
const canAccess = (user, transaction) => {
    return user.role === 'admin' || transaction.client.equals(user._id) || transaction.seller.equals(user._id);
};

// transaction creation
const createTransaction = async (req, res) => {
    if (!['client', 'seller'].includes(req.user.role))
        return res.status(403).json({ error: 'Not authorized to create transactions' });

    try {
        const { client, seller, type, amount } = req.body;

        const transaction = await Transaction.create({ client, seller, type, amount });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//get all
const getTransactions = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { $or: [{ client: req.user._id }, { seller: req.user._id }] };
        const transactions = await Transaction.find(filter)
            .populate('client', 'name email')
            .populate('seller', 'name email');
        res.json(transactions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// get one
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('client', 'name email')
            .populate('seller', 'name email');
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        if (!canAccess(req.user, transaction))
            return res.status(403).json({ error: 'Not authorized' });

        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// delete
const deleteTransaction = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Only admin can delete transactions' });

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { createTransaction, getTransactions, getTransaction, deleteTransaction };
