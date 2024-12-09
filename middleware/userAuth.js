import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to verify token and attach user to request
const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
};

export default userAuth;