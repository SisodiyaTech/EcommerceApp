import express from "express";
import { registerUser , loginUser , logout , getUsers , getProfile , resetPassword , otpVerify , newPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout" , logout)
router.post("/resetPassword" , resetPassword)
router.post("/otpVerify" , otpVerify)
router.post("/newPassword" , newPassword)


router.get("/profile" , getProfile);
router.get("/users" , getUsers )

export default router;