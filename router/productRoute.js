import express from "express";
const router = express.Router();
import {
  addProduct,
  getFeaturedProduct,
  getProducts,
  getSingleProduct,
} from "../controller/productController.js";

router.route("/getProducts").get(getProducts);
router.route("/getFeaturedProduct").get(getFeaturedProduct);
router.route("/getProduct/:id").get(getSingleProduct);
router.route("/createProduct").post(addProduct);

export default router;
