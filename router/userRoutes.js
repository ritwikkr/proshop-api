import express from "express";
import {
  addAddress,
  forgotPassword,
  login,
  signup,
  updatePassword,
  updateUser,
} from "../controller/userController.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/addAddress").put(addAddress);
router.route("/update").put(updateUser);
router.route("/updatePassword").put(updatePassword);
router.route("/forgotPassword").post(forgotPassword);

export default router;
