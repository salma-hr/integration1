const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // buyer
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // seller
    type: { type: String, enum: ['purchase', 'refund'], required: true }, 
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
