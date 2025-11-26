const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '7d' });
};


// signup
const signupUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const user = await User.signup(name, email, password, phone, role);
        const token = createToken(user._id, user.role);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id, user.role);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signupUser, loginUser };
    

