import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js'; // Adjust the path as necessary
import userAuth from '../middleware/userAuth.js'; // Authentication middleware

const cartrouter = express.Router();

// Route to add a product to the user's cart
cartrouter.post('/add-to-cart', userAuth, addToCart);

// Route to update the cart (e.g., changing quantities)
cartrouter.put('/update-cart', userAuth, updateCart);

// Route to get the current cart data for a user
cartrouter.get('/user-cart', userAuth, getUserCart);

export default cartrouter;