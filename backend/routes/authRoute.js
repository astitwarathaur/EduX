import express from "express";
import {
  googleSignup,
  login,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp); // route for signup
authRouter.post("/login", login); // route for login
authRouter.get("/logout", logOut); // route for logout
authRouter.post("/googlesignup", googleSignup); 
authRouter.post("/sendotp", sendOtp);
authRouter.post("/verifyotp", verifyOtp);
authRouter.post("/resetpassword", resetPassword);

export default authRouter;
