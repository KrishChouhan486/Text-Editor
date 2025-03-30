import express from "express"; 
import passport from "passport";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Use process.env for backend
const router = express.Router();

// Google OAuth Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/editor`); // ✅ Fixed template literal
  }
);

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid", { path: "/" }); // Ensure the cookie is properly cleared
      res.status(200).json({ message: "Logged out successfully" }); // ✅ Corrected JSON response
    });
  });
});

export default router;
