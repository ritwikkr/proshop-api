import express from "express";

import verifyJWT from "../middleware/jwtVerify.js";
import {
  createOrder,
  getOrder,
  getOrderByOrderId,
} from "../controller/orderController.js";

const router = express.Router();

router.route("/create").post(createOrder);
router.route("/getOrder").post(getOrder);
router.route("/:orderId").get(getOrderByOrderId);

// TEST
// router.route("/deleteAll").delete(deleteAllOrder);
export default router;
