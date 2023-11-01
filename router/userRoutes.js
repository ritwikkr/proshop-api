import express from "express";
import {
  addAddress,
  checkJWTExpiry,
  deleteAddress,
  forgotPassword,
  login,
  resetPassword,
  signup,
  updatePassword,
  updateUser,
} from "../controller/userController.js";
import verifyJWT from "../middleware/jwtVerify.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/addAddress").patch(addAddress);
router.route("/deleteAddress").delete(deleteAddress);
router.route("/update").put(updateUser);
router.route("/updatePassword").put(updatePassword);
router.route("/resetPassword").patch(verifyJWT, resetPassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/checkJWTExpiry").post(verifyJWT, checkJWTExpiry);

export default router;
