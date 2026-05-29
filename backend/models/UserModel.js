const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
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
});

/*******************userModel*********************/

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
        required: true,
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
    // role: {
    //     type: String,
    //     default: "user"
    // },
    // otp: {
    //     type: String
    // },
    // otpExpiry: {
    //     type: Date
    // },
    // wishlist: [wishlistItemSchema],
});

/******hooks in mongodb********/

userSchema.pre("save", async function (next) {
    const user = this;
    const password = user.password;
    const confirmPassword = user.confirmPassword;
    if (password == confirmPassword) {
        delete user.confirmPassword
        // user.password = await bcrypt.hash(password, 10);
    } else {
        const err = new Error("Password and confirmPassword are not the same ")
        next(err)
    }
})

// userSchema.post("save", () => { 
//     this.__v = undefined;
// })

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
