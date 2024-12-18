import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    type: String,
    street: String,
    district: String,
    province: String,
    postcode: String,
    isDefault: Boolean,
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // hashed
    role: {
        type: { type: String }, // "customer", "admin"
        permissions: [String],
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        phone: String,
        birthdate: Date,
    },
    addresses: [addressSchema],
    cartData: {
        type: Map,
        of: new mongoose.Schema({ // This allows for dynamic keys
            size: { type: Map, of: Number }
        })
    }
});

const User = mongoose.model('User', userSchema);
export default User;