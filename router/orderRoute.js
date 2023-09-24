import express from "express";
import {
  createOrder,
  //   deleteAllOrder,
  getOrder,
} from "../controller/orderController.js";
const router = express.Router();

router.route("/create").post(createOrder);
router.route("/getOrder").post(getOrder);

// TEST
// router.route("/deleteAll").delete(deleteAllOrder);
export default router;
