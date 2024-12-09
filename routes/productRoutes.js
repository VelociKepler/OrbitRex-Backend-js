// productRoutes.js
import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js'; // Ensure the path is correct
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import validateProduct from "../middleware/validateProduct.js";

const productrouter = express.Router();

productrouter.post('/products',adminAuth,validateProduct,createProduct);

productrouter.get('/products',getProducts);

productrouter.get('/products/:id',getProductById);

productrouter.put('/products/:id', updateProduct,adminAuth,validateProduct);

productrouter.delete('/products/:id', deleteProduct,adminAuth);

export default productrouter;