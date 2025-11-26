const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile', requireAuth, getProfile); // Nouvelle route


module.exports = router;
