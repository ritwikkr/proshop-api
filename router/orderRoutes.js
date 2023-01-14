import express from "express";
import {
  createOrder,
  getKey,
  payOrder,
} from "../controller/orderController.js";
const router = express.Router();

router.route("/get-razorpay-key").get(getKey);
router.route("/create-order").post(createOrder);
router.route("/pay-order").post(payOrder);

export default router;
