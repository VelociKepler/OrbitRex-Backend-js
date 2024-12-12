// Step 1
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://orbit-rex-living.vercel.app/",
    "https://ordbit-rexadmin-page.vercel.app/",
    "https://ordbit-rexadmin-page-31ga4muhi-thiramet-phuthongs-projects.vercel.app/",
    "https://ordbit-rexadmin-page-31ga4muhi-thiramet-phuthongs-projects.vercel.app"
];

// Configure CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Working");
});

app.use("/api",productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});