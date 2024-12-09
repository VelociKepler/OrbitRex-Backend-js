// productController.js
import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const imageFiles = req.files; // Assuming multer or similar middleware is used

        // Ensure images are present
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // Upload each image to Cloudinary
        const imageUrls = await Promise.all(imageFiles.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: "image"
            });
            return result.secure_url;
        }));

        // Create product instance with image URLs
        const productData = {
            ...req.body, // Include all other product data
            images: imageUrls // Assuming your product model has an 'images' field
        };

        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};