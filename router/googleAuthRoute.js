import { Router } from "express";
import passport from "passport";
import User from "../model/userSchema.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    // Extract user information from the req.user object
    const user = req.user;
    const token = user.createJWT();
    const { id: googleId, name, email } = user;

    // Find the user in the database by their email
    const data = await User.findOne({ email });

    // Extract wishlist and address safely
    const wishlist = data?.wishlist || [];
    const address = data?.address || [];
    const _id = data._id;

    // Prepare the redirect URL with properly encoded query parameters
    const redirectUrl = new URL("http://localhost:3000/auth/google/callback");
    redirectUrl.searchParams.set("googleId", googleId);
    redirectUrl.searchParams.set("name", name);
    redirectUrl.searchParams.set("email", email);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("_id", _id);
    redirectUrl.searchParams.set("wishlist", JSON.stringify(wishlist));
    redirectUrl.searchParams.set("address", JSON.stringify(address));
    // Redirect to the client with user information as query parameters
    res.redirect(redirectUrl.toString());
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
