// productController.js
import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const createProduct = async (req, res) => {
    try {
        const { name, description, pricing, category, stock, color, metadata } = req.body;
        const { images: bodyImages } = req.body;
        const imageFiles = req.files;

        if (!bodyImages && (!imageFiles || imageFiles.length === 0)) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        const imageUrls = [];

        if (bodyImages) {
            try {
                const parsedBodyImages = Array.isArray(bodyImages) ? bodyImages : [bodyImages];
                imageUrls.push(...parsedBodyImages);
            } catch (error) {
                console.error("Error processing body images:", error);
                return res.status(400).json({ success: false, message: "Invalid images in request body" });
            }
        }

        if (imageFiles && imageFiles.length > 0) {
            for (const file of imageFiles) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                    fs.unlinkSync(file.path);
                    imageUrls.push(result.secure_url);
                } catch (error) {
                    console.error("Image upload failed:", error);
                    return res.status(500).json({ success: false, message: "Image upload failed" });
                }
            }
        }

        const productData = {
            name,
            description,
            pricing,
            category,
            stock,
            color,
            metadata,
            images: imageUrls,
        };

        // Save product to the database
        const newProduct = await Product.create(productData);
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        const validCategories = ['sofa', 'chair', 'table'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid category." });
        }

        const products = await productModel.find({ category });
        res.json({ success: true, products });

    } catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all products
export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = {
            ...(search && { name: { $regex: search, $options: 'i' } }),
            ...(category && { category }) 
        };

        const products = await Product.find(query);
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