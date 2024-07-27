const express = require("express");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require('cookie-parser');
require('dotenv').config();
authRouter.use(cookieParser());
const jwtSecret = process.env.JWT_SECRET || "fasesaddyuasqwee16asdas2"; 

// Đăng ký
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Tài khoản đã tồn tại!" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
    });
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Đăng nhập
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email này không tồn tại!" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng!" });
    }
    jwt.sign({ 
      email: user.email, 
      id: user._id, 
     }, jwtSecret, {}, async (err, token) => {
      if (err) {
        console.error("JWT error:", err);
        return res.status(500).json({ error: "JWT error" });
      }
      user.token = token;
      await user.save();  
      res.cookie('token', token).json(user);
    });
  } catch (e) {
    console.error("Sign-in error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Xác thực token
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, jwtSecret);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//Lấy thông tin profile
authRouter.get("/api/profile", (req, res) => {
  const {token} = req.cookies;
  if(token){
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
         const {email, name, phone, _id} = await User.findById(userData.id);
          res.json(email, name, phone, _id);
      });
  }else{
    res.json(null);
  } 
});

// Đăng xuất
authRouter.post("/logout", (req, res) => {
  res.cookie('token', '').json({ success: true });
});

// Cập nhật thông tin hồ sơ
authRouter.post("/api/updateProfile", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Không tìm thấy token, vui lòng đăng nhập lại" });
    }
    // Xác thực token
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ error: "Token không hợp lệ, vui lòng đăng nhập lại" });
      }
      const userId = userData.id;
      const updatedUser = await User.findByIdAndUpdate(userId, { name, phone, email, address }, { new: true });
      res.status(200).json({ success: true, user: updatedUser });
    });
  } catch (error) {
    console.error("Cập nhật thông tin hồ sơ:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật thông tin hồ sơ" });
  }
});

module.exports = authRouter;
