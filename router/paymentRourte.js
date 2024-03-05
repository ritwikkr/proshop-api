import express from "express";
import {
  razorpayPayment,
  stripePayment,
} from "../controller/paymentController.js";

const router = express.Router();

router.route("/").post(stripePayment);
router.route("/razor").post(razorpayPayment);

export default router;
