import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Import routes & config
import connectDB from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/upload.js";
import "./utils/passportSetup.js"; // Ensure passport setup is loaded

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Configuration (Fix for CORS errors)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"; // Get from .env file

app.use(
  cors({
    origin: frontendUrl, // Use dynamic frontend URL from .env
    credentials: true, // Allow cookies and sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Setup (Fix for session & cookie issues)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true, // Prevent JavaScript access
      sameSite: "None", // Required for cross-origin sessions
    },
  })
);

// ✅ Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/", authRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my project");
});

// 🔹 Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// 🔹 Login Route
app.post("/login", async (req, res) => {
  console.log("📩 Received login request:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("❌ Missing email or password");
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("🔎 User found:", user); // Debugging

    if (!user) {
      console.error("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      console.error("❌ Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ message: "Login Successful" });
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Logout Route (Fixed CORS & Session issues)
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Session destruction failed" });
      }

      res.clearCookie("connect.sid", { path: "/" }); // Clear session cookie
      res.json({ message: "Logout successful!" });
    });
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
