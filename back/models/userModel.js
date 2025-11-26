const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'seller', 'admin'],
        default: 'client'
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true });


// signup
userSchema.statics.signup = async function (name, email, password, phone, role) {

    // validation
    if (!name || !email || !password || !phone) {
        throw new Error('All fields must be filled');
    }

    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }

    if (!validator.isMobilePhone(phone, 'any')) {
        throw new Error('Phone number is not valid');
    }

    if (!validator.isLength(password, { min: 8 })) {
        throw new Error('Password must be at least 8 characters');
    }

    
    if (!/[A-Z]/.test(password)) throw new Error('Password must include an uppercase letter');
    if (!/[a-z]/.test(password)) throw new Error('Password must include a lowercase letter');
    if (!/[0-9]/.test(password)) throw new Error('Password must include a number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new Error('Password must include a special character');

    // email
    const exists = await this.findOne({ email });
    if (exists) throw new Error('Email already in use');

    // hachaing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ name, email, password: hash, phone, role });
    return user;
};


// login
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw new Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
