const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Watchlist Schema

const watchlistItemSchema = new mongoose.Schema({
    poster_path: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    id: { 
        type: String, 
        required: true 
    },
    media_type: { 
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true        
    }
});


// User Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    }
    ,
    confirmPassword: {
        type: String,
        minlength: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Date
    },
    wishlist: [watchlistItemSchema],
});


// MongoDb pre hook

userSchema.pre("save", async function () {
    // If password hasn't changed, move on.
    if (!this.isModified('password')) {
        return;
    }   
    
    // Validation check
    if (this.password !== this.confirmPassword) {
        throw new Error("Password and confirmPassword do not match");
    }
    
    // Hashing
    this.password = await bcrypt.hash(this.password, 12);

    // Setting to undefined to prevent it from saving to the DB
    this.confirmPassword = undefined;
});


const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
