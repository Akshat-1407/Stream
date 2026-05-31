const UserModel = require("../models/UserModel");

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { _id, name, email, createdAt, isPremium } = await UserModel.findById(userId);
        res.status(200).json({
            user: {
                _id: _id,
                name: name,
                email: email,
                createdAt: createdAt,
                isPremium: isPremium,
            },
            status: "success",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};


const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId);

        res.status(200).json({
            data: user.wishlist,
            status: "success",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};


const addToWishlist = async (req, res) => {
    try {
        // Get authenticated user's id from middleware
        const userId = req.user._id;

        const { id, poster_path, name, media_type, description } = req.body;

        // Find user in database
        const user = await UserModel.findById(userId);

        // Return 404 if user does not exist
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the item already exists in the wishlist
        if (user.wishlist.find(item => item.id === id)) {
            return res.status(400).json({
                message: "Item already in wishlist",
                status: "failure",
            });
        }

        // Create wishlist item object
        const wishlistItem = {
            poster_path,
            name,
            id,
            media_type,
            description
        };

        // Add item to wishlist in database
        await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { wishlist: wishlistItem } },
            {
                new: true,     // Return updated document
                upsert: true,  // Create document if it doesn't exist
            }
        );

        // Send success response
        return res.status(200).json({
            status: "success",
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};

module.exports = { getCurrentUser, getUserWishlist, addToWishlist };