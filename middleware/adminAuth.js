import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Retrieve token from `Authorization` header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Admin access only." });
        }

        req.body.adminId = token_decode.id; // Attach admin ID if needed
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ success: false, message: "Token verification failed. Please log in again." });
    }
};

export default adminAuth;