const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
    createTransaction,
    getTransactions,
    getTransaction,
    deleteTransaction
} = require('../controllers/transactionController');

router.use(requireAuth); 

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.delete('/:id', deleteTransaction); 

module.exports = router;
