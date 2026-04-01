const express = require('express');
const { loginHandler, signupHandler, forgetPasswordHandler, resetPasswordHandler, logoutHandler } = require("../controllers/AuthController");

const AuthRouter = express.Router();

AuthRouter.post("/signup", signupHandler);
AuthRouter.post("/login", loginHandler);
AuthRouter.get("/logout", logoutHandler);
AuthRouter.patch("/forgetPassword", forgetPasswordHandler);
AuthRouter.patch("/resetPassword/:userId", resetPasswordHandler);

module.exports = AuthRouter;