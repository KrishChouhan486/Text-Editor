import passport from "passport";

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleAuthCallback = passport.authenticate("google", { failureRedirect: "/" });

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.redirect("http://localhost:5173/editor"); // Redirect to frontend
};

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173/login"); // Redirect to frontend
  });
};