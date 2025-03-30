import express from "express"; 
import passport from "passport";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Use process.env for backend
const router = express.Router();

// 🔍 Debugging: Log when the route file is loaded
console.log("✅ Auth Routes Loaded");

// Google OAuth Login
router.get("/auth/google", (req, res, next) => {
  console.log("🔵 Google OAuth Login Initiated"); // ✅ Log request initiation
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth Callback
router.get("/auth/google/callback", (req, res, next) => {
  console.log("🔵 Google OAuth Callback Triggered"); // ✅ Log when callback is hit

  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("❌ Google Auth Error:", err); // 🔴 Log error
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
    if (!user) {
      console.warn("⚠️ Google Auth Failed:", info); // ⚠️ Log failure reason
      return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("❌ Login Error:", loginErr);
        return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
      }
      console.log("✅ User Authenticated:", user); // ✅ Log successful login
      return res.redirect(`${FRONTEND_URL}/editor`);
    });
  })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res, next) => {
  console.log("🔵 Logout Request Received");

  req.logout((err) => {
    if (err) {
      console.error("❌ Logout Error:", err);
      return next(err);
    }

    req.session.destroy((error) => {
      if (error) {
        console.error("❌ Session Destroy Error:", error);
        return next(error);
      }

      console.log("✅ Session Destroyed, Logging Out");
      res.clearCookie("connect.sid", { path: "/" }); // Ensure the cookie is properly cleared
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
