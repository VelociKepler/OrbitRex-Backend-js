import express from "express";
import {
    placeOrderStripe,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

// Admin Routes
orderRouter.post("/list", adminAuth, allOrders); // Get all orders (Admin access only)
orderRouter.post("/status", adminAuth, updateStatus); // Update order status (Admin access only)

// User Payment
orderRouter.post("/stripe", userAuth, placeOrderStripe); // Place an order with Stripe

// User Routes
orderRouter.post("/userorders", userAuth, userOrders); // Fetch authenticated user's orders

// Payment Verification
orderRouter.post("/verifyStripe", userAuth, verifyStripe); // Verify Stripe payment status

export default orderRouter;