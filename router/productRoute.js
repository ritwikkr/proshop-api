import express from "express";
const router = express.Router();
import {
  addProduct,
  getProducts,
  getSingleProduct,
} from "../controller/productController.js";

router.route("/getProducts").get(getProducts);
router.route("/getProduct/:id").get(getSingleProduct);
router.route("/createProduct").post(addProduct);

export default router;
