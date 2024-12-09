import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({
    product: {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        productPrice: Number,
    },
    variant: {
        size: String,
        color: String,
    },
    quantity: Number,
    subtotal: Number,
});

const orderSchema = new mongoose.Schema({
    user: {
        userId: mongoose.Schema.Types.ObjectId,
        userEmail: String,
        username: String,
    },
    items: [orderItemSchema],
    shipping: {
        method: String,
        address: {
            street: String,
            district: String,
            province: String,
            postcode: String,
        },
        tracking: {
            number: String,
            carrier: String,
            status: String,
        },
    },
    payment: {
        method: String,
        status: String, // "pending", "paid", "failed"
        total: Number,
        currency: String,
        transactionId: String,
    },
    status: {
        current: String, // "created", "processing", "shipped", "delivered", "cancelled"
        history: [{
            state: String,
            timestamp: Date,
        }],
    },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;