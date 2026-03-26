import { genToken } from "../configs/token.js";
import validator from "validator";

import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

import sendMail from "../configs/Mail.js";

// controller function for Signup
export const signUp = async (req, res) => {
  try {
    // get data of user
    let { name, email, password, role } = req.body;
    // find in DB using unque character (email)
    let existUser = await User.findOne({ email });
    // if user exists
    if (existUser) {
      return res.status(400).json({ message: "email already exist" });
    }
    // if email was not valid (check by validator)
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter valid Email" });
    }
    // password condition
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Please enter a Strong Password" });
    }
    // hash the password using bcrypt
    let hashPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    // generate token by jwt (configs)
    let token = await genToken(user._id);
    // generate cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log("signUp error");
    return res.status(500).json({ message: `signUp Error ${error}` });
  }
};

//  controller function for login
export const login = async (req, res) => {
  try {
    // get data from req.body
    let { email, password } = req.body;
    // find the data in DB
    let user = await User.findOne({ email });
    // if user not registered or exists
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    // if Match found =. comapre pass with hash password
    let isMatch = await bcrypt.compare(password, user.password);
    // if not matched
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect Password" });
    }
    // if user matched then generate token and cookies
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log("login error");
    return res.status(500).json({ message: `login Error ${error}` });
  }
};

//  controller function for logout
export const logOut = async (req, res) => {
  try {
    // clear cookies
    await res.clearCookie("token");
    return res.status(200).json({ message: "logOut Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout Error ${error}` });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
      });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `googleSignup  ${error}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    ((user.resetOtp = otp),
      (user.otpExpires = Date.now() + 5 * 60 * 1000),
      (user.isOtpVerifed = false));

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "Email sent Successfully " });
  } catch (error) {
    return res.status(500).json({ message: `send otp error ${error}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified " });
  } catch (error) {
    return res.status(500).json({ message: `Verify otp error ${error}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerifed) {
      return res.status(404).json({ message: "OTP verfication required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerifed = false;
    await user.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset Password error ${error}` });
  }
};
