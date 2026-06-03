const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const util = require("util");
const promisify = util.promisify;
const promisifiedJWTsign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const sendWelcomeMail = require("../services/mail/welcomeMailSender");
const sendOtpMail = require("../services/mail/otpMailSender");
const otpGenerator = require("../utils/otpGenerator");


async function signupHandler(req, res) {
    /**
     * Signup Flow
     *
     * 1. Receive user's registration details
     *    (name, email, password, confirmPassword).
     * 2. Validate that all required fields are provided.
     * 3. Verify that password and confirmPassword match.
     * 4. Check whether an account already exists with the given email.
     * 5. Create a new user in the database.
     * 6. Generate a JWT containing the user's id.
     * 7. Store the JWT in an HTTP-only cookie.
     * 8. Remove sensitive fields from the response.
     * 9. Send a successful signup response.
     * 10. Send a welcome email to the newly registered user.
     */

    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation Logic
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
                status: "failure"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                status: "failure"
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered. Please login instead.",
                status: "failure"
            });
        }

        // Create the user 
        const newUser = await UserModel.create({
            name,
            email,
            password, 
            confirmPassword
        });

        // Generate JWT containing user id
        const authToken = await promisifiedJWTsign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY
        );

        // Store JWT in an HTTP-only cookie
        res.cookie("jwt", authToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        // Send Response (Don't send the password back!)
        newUser.confirmPassword = undefined;
        newUser.password = undefined; 
        
        // Send successful signup response
        res.status(201).json({
            message: "User signed up successfully",
            user: newUser,
            status: "success"
        });

        // Send Welcome Email
        try {
            await sendWelcomeMail(newUser.email, newUser.name);
        } catch (emailErr) {
            console.log("Post-signup email failed:", emailErr);
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "failure"
        });
    }
}

async function loginHandler(req, res) {
    /**
     * Login Flow
     *
     * 1. Receive user's email and password.
     * 2. Verify that a user exists with the provided email.
     * 3. Verify that the provided password matches the stored password.
     * 4. Generate a JWT containing the user's id.
     * 5. Store the JWT in an HTTP-only cookie.
     * 6. Remove sensitive fields from the response.
     * 7. Send a successful login response.
     */

    try {
        // Extract credentials from request body
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Return error if user does not exist
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failure"
            });
        }

        // Verify password
        const areEqual = await bcrypt.compare(password,user.password);

        // Return error if password is incorrect
        if (!areEqual) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failure"
            });
        }

        // Generate JWT containing user id
        const authToken = await promisifiedJWTsign(
            { id: user._id },
            process.env.JWT_SECRET_KEY
        );

        // Store JWT in an HTTP-only cookie
        res.cookie("jwt", authToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        // Remove the password form the response
        user.confirmPassword = undefined;
        user.password = undefined; 

        // Send successful login response
        return res.status(200).json({
            message: "Login successful",
            status: "success",
            user: user
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "failure"
        });
    }
}

async function logoutHandler(req, res) {
    try {
        // Remove the JWT cookie from the browser
        res.clearCookie("jwt", {
            path: "/"
        });

        // Send success response
        return res.status(200).json({
            message: "Logout successful",
            status: "success"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "failure"
        });
    }
}

async function protectRouteMiddleware(req, res, next) {
    try {
        const jwttoken = req.cookies.jwt;
        
        if (!jwttoken) {
            return res.status(401).json({
                 message: "You are not logged in" 
            });
        }

        // Verify the token
        const decoded = await promisifiedJWTVerify(jwttoken, process.env.JWT_SECRET_KEY);

        // Find user but EXCLUDE the password and __v fields
        const user = await UserModel.findById(decoded.id) //.select("-password -__v");

        if (!user) {
            return res.status(401).json({ 
                message: "User no longer exists" 
            });
        }

        // Attach the user object
        req.user = user; 
        next();
        
    } catch (err) {
        const errorMessage = err.name === 'TokenExpiredError' 
            ? "Session expired, please login again" 
            : "Invalid token, please login again";

        return res.status(401).json({ 
            status: "failure",
            message: errorMessage 
        });
    }
};

async function forgetPasswordHandler(req, res) {
    /**
     * Forgot Password Flow
     *
     * 1. Receive user's email address.
     * 2. Validate that the email is provided.
     * 3. Check whether a user exists with that email.
     * 4. Generate an OTP.
     * 5. Store the OTP and its expiry time in the database.
     * 6. Send the OTP to the user's registered email address.
     * 7. Return a success response.
     */

    try {
        const { email } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).json({
                status: "failure",
                message: "Please provide an email address."
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Return error if user does not exist
        if (!user) {
            return res.status(404).json({
                status: "failure",
                message: "No user found with this email address."
            });
        }

        // Generate OTP and set expiry time (10 minutes)
        const otp = otpGenerator();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        // Save OTP details to database
        await user.save({ validateBeforeSave: false });

        // Send OTP to the user's email
        await sendOtpMail(user.name, user.email, otp);

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "OTP sent successfully.",
            userId: user._id
        });

    } catch (err) {
        return res.status(500).json({
            status: "failure",
            message: err.message
        });
    }
}

async function verifyOtpHandler(req, res) {
    /**
     * VERIFY OTP FLOW
     *
     * 1. Receive userId and OTP.
     * 2. Verify user exists.
     * 3. Verify OTP exists.
     * 4. Verify OTP is not expired.
     * 5. Verify OTP matches.
     * 6. Generate temporary reset token.
     * 7. Remove OTP information.
     * 8. Return reset token.
     */

    try {
        const { userId, otp } = req.body;

        // Return if userId or opt does not exist
        if (!userId || !otp) {
            return res.status(400).json({
                status: "failure",
                message: "User ID and OTP are required"
            });
        }

        // Find user by id
        const user = await UserModel.findById(userId);

        // Return error if user does not exist
        if (!user) {
            return res.status(404).json({
                status: "failure",
                message: "User not found"
            });
        }
 

        // Verify that a reset OTP exists
        if (!user.otp) {
            return res.status(401).json({
                status: "failure",
                message: "Unauthorized password reset attempt"
            });
        }

        // Check OTP expiry
        if (Date.now() > user.otpExpiry) {
            return res.status(401).json({
                status: "failure",
                message: "OTP has expired"
            });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(401).json({
                status: "failure",
                message: "Invalid OTP"
            });
        }
 
        // Generate temporary token 
        // This token proves that OTP verification was completed successfully.
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = Date.now() + 5 * 60 * 1000;

        // Remove OTP details after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;

        // Save updated user information
        await user.save({ validateBeforeSave: false });

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "OTP verified successfully",
            resetToken
        });

    } catch (err) {
        return res.status(500).json({
            status: "failure",
            message: err.message
        });
    }
}

async function resetPasswordHandler(req, res) {
    /**
     * RESET PASSWORD FLOW
     *
     * 1. Receive reset token.
     * 2. Verify token exists.
     * 3. Verify token has not expired.
     * 4. Validate passwords.
     * 5. Update password.
     * 6. Remove reset token.
     */

    try {
        const { resetToken, password, confirmPassword } = req.body;

        // Ensure all required fields are provided.
        if (!resetToken || !password || !confirmPassword) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required"
            });
        }

        // Prevent password mismatch.
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "failure",
                message: "Passwords do not match"
            });
        }

        // Find the user who owns the provided reset token.
        const user = await UserModel.findOne({
            resetPasswordToken: resetToken
        });

        // Token is invalid if no matching user is found.
        if (!user) {
            return res.status(401).json({
                status: "failure",
                message: "Invalid reset token"
            });
        }

        // Ensure the reset token has not expired.
        if (Date.now() > user.resetPasswordTokenExpiry) {
            return res.status(401).json({
                status: "failure",
                message: "Reset window expired"
            });
        }

        // Token is valid, update the user's password
        user.password = password;
        user.confirmPassword = confirmPassword;

        // Invalidate the reset token immediately after a successful password change.
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Password reset successfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: "failure",
            message: err.message
        });
    }
}

module.exports = {
    signupHandler,
    loginHandler,
    logoutHandler,
    forgetPasswordHandler,
    verifyOtpHandler,
    resetPasswordHandler,
    protectRouteMiddleware
}