const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const util = require("util");
const promisify = util.promisify;
const promisifiedJWTsign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);


async function signupHandler(req, res) {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation Logic
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields (name, email, password, confirmPassword) are required",
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
        // Note: Ideally, hash the password here or in your Mongoose Model Pre-save hook
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
            httpOnly: true
        });

        // Send Response (Don't send the password back!)
        newUser.confirmPassword = undefined;
        newUser.password = undefined; 
        
        res.status(201).json({
            message: "User signed up successfully",
            user: newUser,
            status: "success"
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: err.message,
            status: "failure"
        });
    }

    // Send Welcom Email
}

async function loginHandler(req, res) {
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

        // hash the password using bcrypt

        // Verify password
        const areEqual = password === user.password;

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
            httpOnly: true
        });

        // Remove the password form the response
        user.confirmPassword = undefined;
        user.password = undefined; 

        // Send successful login response
        res.status(200).json({
            message: "Login successful",
            status: "success",
            user: user
        });

    } catch (err) {
        console.log("err", err);
        res.status(500).json({
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
        res.status(200).json({
            message: "Logout successful",
            status: "success"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure"
        });
    }
}

const protectRouteMiddleware = async function (req, res, next) {
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
        // Using "-field" syntax in select tells Mongoose to leave it out
        const user = await UserModel.findById(decoded.id) //.select("-password -__v");

        if (!user) {
            return res.status(401).json({ 
                message: "User no longer exists" 
            });
        }

        // Attach the user object
        // console.log("Auth cont user: " ,user);
        req.user = user; 
        next();
        
    } catch (err) {
        const errorMessage = err.name === 'TokenExpiredError' 
            ? "Session expired, please login again" 
            : "Invalid token, please login again";

        res.status(401).json({ 
            status: "failure",
            message: errorMessage 
        });
    }
};

async function forgetPasswordHandler(req, res) {
    try {

        /****
         * 1. user send the email : extract email
         * 2. check if email is present in DB (user)
              * if email is not present -> send a response to the user(user not found)
           * *  if email is present -> 
           * 3. create basic otp -> 
           *        * user  ke saath token map krdo
           *        *  send to the email
           * 4. url -> reset url -> id      
         *         
         * ***/
        //1.
        if (req.body.email == undefined) {
            return res.status(401).json({
                status: "failure",
                message: "Please enter the email for forget Password"
            })
        }
        //2.
        const user = await UserModel.findOne({ email: req.body.email });
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "user not found for this email"
            })
        }
        //3. 
        const otp = otpGenerator();
        user.otp = otp;
        user.otpExpiry = Date.now() + 1000 * 60 * 10;

        await user.save({ validateBeforeSave: false });
        //  send email
        // email -> req.body.email
        // otp -> add 
        await sendOtp(user.name, user.email, user.otp);

        res.status(200).json({
            message: "otp is send successfully",
            status: "success",
            otp: otp,
            resetURL: `http://localhost:8080/api/auth/resetPassword/${user["_id"]}`
        })
        
        
    } catch (err) {
        console.log("err", err);
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
}

async function resetPasswordHandler(req, res) {
    try {
        /**
         * 1. id ,  id
         * 2. if otp , password , confirmPassword are present
         *      *  otp should n't be expires
         *      * otp compare -> if matches
         *      *  password update
         *      *  re-route them to login page
         * ***/
        let resetDetails = req.body;
        // required fields are there or not 
        if (!resetDetails.password || !resetDetails.confirmPassword
            || !resetDetails.otp
            || resetDetails.password != resetDetails.confirmPassword) {
            res.status(401).json({
                status: "failure",
                message: "invalid request"
            })
        }
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);
        // if user is not present
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "user not found"
            })
        }
        // if otp is not present  in db user
        if (user.otp == undefined) {
            return res.status(401).json({
                status: "failure",
                message: "unauthorized acces to reset Password"
            })
        }

        // if otp is expired
        if (Date.now() > user.otpExpiry) {
            return res.status(401).json({
                status: "failure",
                message: "otp expired"
            })
        }
        // if otp is incorrect
        if (user.otp != resetDetails.otp) {
            return res.status(401).json({
                status: "failure",
                message: "otp is incorrect"
            })
        }
        user.password = resetDetails.password;
        user.confirmPassword = resetDetails.confirmPassword;
        // remove the otp from the user
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({
            status: "success",
            message: "password reset successfully"
        })

    } catch (err) {
        console.log("err", err);
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
}

const otpGenerator = function () {
    return Math.floor(100000 + Math.random() * 900000);
}


module.exports = {
    signupHandler,
    loginHandler,
    logoutHandler,
    forgetPasswordHandler,
    resetPasswordHandler,
    protectRouteMiddleware
}