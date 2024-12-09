import jwt from 'jsonwebtoken';

// Controller for admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify admin credentials
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Create a JWT token with admin role
            const token = jwt.sign(
                { email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '300d' }
            );

            // Log the token in the console
            console.log("Admin Token:", token);

            // Send the token as a response
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};