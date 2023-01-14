import express from "express";
const router = express.Router();
import {
  createProduct,
  getProducts,
  getSingleProduct,
} from "../controller/productController.js";

router.route("/createProduct").post(createProduct);
router.route("/getProducts").get(getProducts);
router.route("/getProduct/:id").get(getSingleProduct);

export default router;
