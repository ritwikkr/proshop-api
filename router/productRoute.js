import express from "express";
const router = express.Router();
import {
  addProduct,
  deleteRatingAndReview,
  getProducts,
  getSingleProduct,
  getWishlistedProducts,
  ratingsAndReviews,
} from "../controller/productController.js";
import verifyJWT from "../middleware/jwtVerify.js";

router.route("/getProducts").get(getProducts);
router.route("/getProduct/:id").get(getSingleProduct);
router.route("/createProduct").post(addProduct);
router
  .route("/reviews")
  .patch(verifyJWT, ratingsAndReviews)
  .delete(verifyJWT, deleteRatingAndReview);
router.route("/getWishlistedProducts").get(verifyJWT, getWishlistedProducts);

export default router;
