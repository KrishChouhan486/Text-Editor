import express from "express"; 
import passport from "passport";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Use process.env for backend
const router = express.Router();

// 🔍 Debugging: Log when the route file is loaded
console.log("✅ Auth Routes Loaded");

router.get("/auth/google", (req, res, next) => {
  console.log("🔵 Google OAuth Login Initiated", new Date().toISOString()); // ✅ Add timestamp to track multiple requests

  if (req.user) {
    console.log("✅ User already authenticated, redirecting to /editor");
    return res.redirect(`${FRONTEND_URL}/editor`);
  }

  return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});


router.get("/auth/google/callback", (req, res, next) => {
  console.log("🔵 Google OAuth Callback Triggered", new Date().toISOString());

  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("❌ Google Auth Error:", err);
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
    if (!user) {
      console.warn("⚠️ Google Auth Failed:", info);
      return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("❌ Login Error:", loginErr);
        return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
      }

      console.log("✅ User Authenticated:", user);
      console.log("🚀 Redirecting to:", `${FRONTEND_URL}/editor`);

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
