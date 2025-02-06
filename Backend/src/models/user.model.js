// user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_Name: {
        type: String,
        required: true
    },
    last_Name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: "not_specified"
    },
    date_of_birth: {
        type: Date,
        default: Date.now
    },
    phone_number: {
        type: String,
        default: "not_specified"
    },
    password: {
        type: String,
        required: true
    },
    confirm_Password: {
        type: String,
        required: true
    },
    state_of_residence: {
        type: String,
        default: "not_specified"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationTokenExpire: Date,
    googleId: String,
    googleProfilePicture: String,
    googleDisplayName: String,
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;