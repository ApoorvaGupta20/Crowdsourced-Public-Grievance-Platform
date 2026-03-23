import express from "express";
import { sendOTP, verifyOTP,updateProfile,getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/verify", verifyOTP);
router.post("/login",sendOTP);
router.post("/update-profile",authMiddleware,updateProfile);
router.get("/me", authMiddleware, getMe);
export default router;