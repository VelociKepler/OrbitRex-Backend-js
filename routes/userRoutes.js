import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';
import userAuth from "../middleware/userAuth.js";
const userrouter = express.Router();

// Route for user registration
userrouter.post('/register', registerUser);

// Route for user login
userrouter.post('/login', loginUser);

// Route to get user profile
userrouter.get('/profile',userAuth, getUserProfile);

// Route to update user profile
userrouter.put('/profile',userAuth, updateUserProfile);

// Route to delete user
userrouter.delete('/',userAuth, deleteUser);

export default userrouter;