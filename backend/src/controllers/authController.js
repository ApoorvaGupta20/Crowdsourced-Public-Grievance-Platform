import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================
// 1️⃣ Send OTP
// ==========================
export const sendOTP = async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ message: "Phone or Email required" });
    }

    const otp = generateOTP();

    let user = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (!user) {
      user = new User({ phone, email });
    }

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    console.log("Generated OTP:", otp);

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 2️⃣ Verify OTP
// ==========================
export const verifyOTP = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const user = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
      profileComplete: !!user.username,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 3️⃣ Complete Profile
// ==========================
export const updateProfile = async (req, res) => {
  try {
    const { name, username, email, gender, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    // username uniqueness check
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.json({ message: "Profile updated", user });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe=async(req,res)=>{
  try{
    const user=await User.findById(req.user.id);
    res.json(user);
  }
  catch(err){
    res.status(500).json({message:"server error"});
  }
};