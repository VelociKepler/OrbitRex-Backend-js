// Step 1
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
//import connectCloudinary from "./config/cloudinary.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Working");
});

app.use("/api",productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});