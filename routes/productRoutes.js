// productRoutes.js
import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js'; // Ensure the path is correct
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import validateProduct from "../middleware/validateProduct.js";

const productrouter = express.Router();

productrouter.post('/products',
    adminAuth,
    validateProduct,
    upload.array('images',4),createProduct
);

productrouter.get('/products',getProducts);

productrouter.route('/products/:id')
    .get(getProductById)
    .put(adminAuth, validateProduct, updateProduct)
    .delete(adminAuth, deleteProduct);

export default productrouter;