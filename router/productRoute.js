import express from "express";
const router = express.Router();
import {
  addProduct,
  getFeaturedProduct,
  getProducts,
  getSingleProduct,
  ratingsAndReviews,
} from "../controller/productController.js";
import verifyJWT from "../middleware/jwtVerify.js";

router.route("/getProducts").get(getProducts);
router.route("/getFeaturedProduct").get(getFeaturedProduct);
router.route("/getProduct/:id").get(getSingleProduct);
router.route("/createProduct").post(addProduct);
router.route("/reviews").patch(verifyJWT, ratingsAndReviews);

export default router;
