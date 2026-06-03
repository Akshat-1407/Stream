const Razorpay = require("razorpay");
const UserModel = require("../models/UserModel");
const sendPaymentSuccessMail = require("../services/mail/paymentSuccessMail")

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

// create the order so that user can checkout on frontend 
const getPaymentController = async (req, res) => {
    try {
        const data = await razorpay.orders.create({
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "Receipt_Id" + Date.now(),
        });
        return res.status(200).json({
            amount: data.amount,
            orderId: data.id,
        });
    } catch (err) {
        return res.status(500).json({ 
            message: "Failed to create order",
            status: "failure"
        });
    }
};

// updation of status of premium access
const updatePremiumAccessController = async (req, res) => {
    try {
        const { email, planName, amount, paymentId, orderId } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            { $set: { isPremium: true } },
            { new: true }
        );

        await sendPaymentSuccessMail(
            updatedUser.name,
            updatedUser.email,
            planName,
            amount,
            paymentId,
            orderId
        );

        return res.status(200).json({
            message: {
                isPremium: true
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to Update Premium Access",
            status: "failure"
        });
    }
};

module.exports = {
    getPaymentController,
    updatePremiumAccessController,
};

