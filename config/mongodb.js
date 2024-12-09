import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB ✅");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/orbitRex`);

        console.log("MongoDB connection successful.");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error connecting to MongoDB ❌:", error.message);
        } else {
            console.error("Unknown error connecting to MongoDB ❌:", error);
        }
        process.exit(1);
    }
};

export default connectDB;