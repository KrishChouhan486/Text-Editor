import express from "express"; 
import passport from "passport";

const router = express.Router();

// Google OAuth Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/editor"); // Redirect to TextEditor
  }
);

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
      res.status(200).json({ message: "Logged out successfully" }); // Send a JSON response instead of redirecting
    });
  });
});

  

export default router;