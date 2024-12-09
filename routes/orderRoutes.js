import express from 'express';
import { placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';

const orderRouter = express.Router();

orderRouter.post('/place-order', userAuth, placeOrderStripe);
orderRouter.post('/verify-stripe', userAuth, verifyStripe);
orderRouter.get('/all-orders', userAuth, allOrders);
orderRouter.post('/user-orders', userAuth, userOrders);
orderRouter.put('/update-status', userAuth, updateStatus);

export default orderRouter;