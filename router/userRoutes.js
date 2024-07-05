import express from "express";
import {
  addAddress,
  checkJWTExpiry,
  deleteAddress,
  forgotPassword,
  login,
  resetPassword,
  signup,
  toggleWishlist,
  updatePassword,
  updateUser,
  verifyOTP,
} from "../controller/userController.js";
import verifyJWT from "../middleware/jwtVerify.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);
router.route("/addAddress").patch(addAddress);
router.route("/deleteAddress").delete(deleteAddress);
router.route("/update").put(updateUser);
router.route("/updatePassword").put(updatePassword);
router.route("/resetPassword").patch(verifyJWT, resetPassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/checkJWTExpiry").post(verifyJWT, checkJWTExpiry);
router.route("/toggleWishlist").post(verifyJWT, toggleWishlist);

export default router;
