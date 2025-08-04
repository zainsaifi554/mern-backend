import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: { type: String },
        email: { type: String, unique: true, required: true },
        phone: { type: String },
        password: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female'] },
        city: { type: String },
        dateofbirth: { type: String },
        isProfileComplete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

export default User;