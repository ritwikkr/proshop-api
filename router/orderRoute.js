import express from "express";
import { createOrder, getOrder } from "../controller/orderController.js";
const router = express.Router();

router.route("/create").post(createOrder);
router.route("/getOrder").post(getOrder);

export default router;
