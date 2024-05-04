import express from "express";
import {
  getWishlistItems,
  toggleWishlistItem,
} from "../controller/wishlistController.js";
import jwtVerify from "../middleware/jwtVerify.js";

const router = express.Router();

router
  .route("/")
  .get(jwtVerify, getWishlistItems)
  .post(jwtVerify, toggleWishlistItem);

export default router;
