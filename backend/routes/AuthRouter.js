const express = require('express');
const { loginHandler, signupHandler, forgetPasswordHandler, verifyOtpHandler, resetPasswordHandler, logoutHandler } = require("../controllers/AuthController");

const AuthRouter = express.Router();

AuthRouter.post("/signup", signupHandler);
AuthRouter.post("/login", loginHandler);
AuthRouter.get("/logout", logoutHandler);
AuthRouter.post("/forgetPassword", forgetPasswordHandler);
AuthRouter.post("/verifyOtp/:userId", verifyOtpHandler);
AuthRouter.patch("/resetPassword/", resetPasswordHandler);

module.exports = AuthRouter;