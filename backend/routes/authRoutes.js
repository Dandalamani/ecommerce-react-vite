const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

/* ================= OTP STORE ================= */
const otpStore = {};

/* ================= MAIL CONFIG ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (Date.now() > record.expires) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // mark verified
  otpStore[email].verified = true;

  res.json({ message: "OTP verified successfully" });
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const record = otpStore[email];

    if (!record || !record.verified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // cleanup OTP
    delete otpStore[email];

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const record = otpStore[email];

    if (!record || !record.verified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // cleanup OTP after login
    delete otpStore[email];

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
