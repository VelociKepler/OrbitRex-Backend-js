import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        // Find user by ID
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Initialize cart data if not present
        let cartData = userData.cartData || new Map();

        if (!cartData[itemId]) {
            cartData[itemId] = { };
        }
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        userData.cartData = cartData;
        await userData.save();

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const cartData = userData.cartData;

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        userData.cartData = cartData;
        await userData.save();

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error retrieving user cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };