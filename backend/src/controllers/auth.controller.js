import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import cookieParser from "cookie-parser";
import generateOtp from "../utils/generateOtp.js";
import { sendMail } from "../services/sendMail.js";
import PasswordResetOTP from "../models/ResetOtp.models.js"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if user already exists
    const UserExist = await User.findOne({ email });

    if (UserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate a token for the new user

    const token = createToken(user._id);

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Adjust based on requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return the user data and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a token for the user
    const token = createToken(user._id);

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Adjust based on requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return the user data and token
    res.status(200).json({
      message: "User login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        message: "User not find",
      });
    }

    res.status(400).json({
      message: "user Profile get successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { name, email } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const Otp = await generateOtp();

    const HashedOtp = await bcrypt.hash(Otp, 10);

    await PasswordResetOTP.create({
      user: user._id,
      otpHash: HashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const subject = "Your E-commerce password reset request";
    const message = `Hi ${name},
    We received a request to reset the password for your E-commerce account.

    If you made this request, Your OTP is ${Otp}. 
    Please Verify your account and reset your password`

    await sendMail(email, subject, message);

    res.status(200).json({ message: "OTP sent to your email" })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const otpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDocument = await PasswordResetOTP.findOne({ email });

    if (!otpDocument) {
      return res.status(404).json({ message: "OTP not found" })
    }
    const isOtpValid = await bcrypt.compare(otp, otpDocument.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (otpDocument.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    await PasswordResetOTP.deleteOne({ _id: otpDocument._id });

    res.status(200).json({ message: "OTP verified successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    await user.save();
    res.status(200).json({ message: "Password updated successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
