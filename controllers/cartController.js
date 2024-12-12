import Cart from "../models/cartModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { productId, color } = req.body; // Adjusted from itemId to productId
        const userId = req.user.id;

        // Validate user
        const userExists = await userModel.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Validate product
        const productExists = await productModel.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.color === color);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ productId, color, quantity: 1 });
        }

        await cart.save();
        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { productId, color, quantity } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.color === color);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId'); // Adjusted populate option
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        res.json({ success: true, cartData: cart.items });

    } catch (error) {
        console.error("Error retrieving user cart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };