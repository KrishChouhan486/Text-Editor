import passport from "passport";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Use process.env for backend

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleAuthCallback = passport.authenticate("google", { failureRedirect: "/" });

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.redirect(`${FRONTEND_URL}/editor`); // ✅ Corrected template literals
};

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect(`${FRONTEND_URL}/login`); // ✅ Corrected template literals
  });
};
