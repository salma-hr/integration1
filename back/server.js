require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//requiration 
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// express app
const app = express();

// middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next ) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);


app.get('/', (req, res) => {
  res.send('API is working');
});


// server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// connect to db
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.log("MongoDB connection error:", error));




