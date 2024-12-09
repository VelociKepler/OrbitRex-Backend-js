import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    pricing: String,
    stock: {
        total: Number,
        status: String, // "in_stock", "out_of_stock"
    },
    images: String,
    color: [String],
    metadata: {
        brand: String,
        weight: Number,
        dimensions: {
            width: Number,
            height: Number,
            length: Number,
        },
    },
});

const Product = mongoose.model('Product', productSchema);
export default Product;