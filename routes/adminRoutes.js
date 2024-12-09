import express from 'express';
import { adminLogin } from '../controllers/adminController.js';

const router = express.Router();

// Route for admin login
router.post('/login', adminLogin);

export default router;