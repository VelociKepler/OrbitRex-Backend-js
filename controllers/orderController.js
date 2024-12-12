import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Global variables
const currency = "thb"; // Your preferred currency
const deliveryCharge = 10; // Delivery charge in the smallest unit

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders with Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"; // Fallback for origin

        const orderData = {
            userId: req.user._id, // Extracted from userAuth middleware
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        // Save order in DB
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order via Stripe:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            // Mark the order as paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Clear user cart after payment success
            await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });

            res.json({ success: true, message: "Payment successful" });
        } else {
            // Delete the order if payment failed
            await orderModel.findByIdAndDelete(orderId);
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders (for admin panel)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a user's orders (for frontend)
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user._id }); // User ID from userAuth middleware
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status (for admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Update the order's status in the database
        await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ success: true, message: "Order status updated successfully." });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus };