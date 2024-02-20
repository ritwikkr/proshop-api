import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productSchema.js";
import User from "../model/userSchema.js";

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const skip = (page - 1) * pageSize;

  const products = await Product.find().skip(skip).limit(pageSize);

  if (!products) {
    res.status(404);
    throw new Error("Product not found!!!");
  }

  const totalCount = await Product.countDocuments();

  res.json({
    products,
    page,
    pageSize,
    totalCount,
  });
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = await Product.findById(id)
    .populate({
      path: "ratingsAndReviews.ratingAndReview",
      populate: {
        path: "userId",
        model: "User",
        select: "name",
      },
    })
    .exec();
  if (!data) {
    res.status(404);
    throw new Error("Product Not Found");
  }
  res.status(200).json(data);
});

// ADMIN
const addProduct = asyncHandler(async (req, res) => {
  const data = await Product.create(req.body);
  res.status(201).json(data);
});

// POST: Give ratings
const ratingsAndReviews = asyncHandler(async (req, res) => {
  const { rating: ratings, productId, review } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(400).json("Product Not Found");
  }

  // Convert req.user to ObjectId type
  const { userId } = req.userData;

  const { name } = await User.findById(userId);

  // Add the new rating to the product's ratingsAndReviews
  product.ratingsAndReviews.ratingAndReview.push({
    userId: { _id: req.userData.userId, name },
    ratings,
    review,
  });

  // Save the updated product with the new rating
  const updatedProduct = await product.save();

  // Calculate the updated total ratings and update it in the product document
  updatedProduct.ratingsAndReviews.totalRatings =
    updatedProduct.ratingsAndReviews.ratingAndReview.length;

  await updatedProduct.save();

  res.status(200).json({
    success: true,
    message: "Rating added successfully",
    ratingsAndReviews: updatedProduct.ratingsAndReviews,
  });
});

// DELETE: Delete Ratings and review
const deleteRatingAndReview = asyncHandler(async (req, res) => {
  const { productID, userID } = req.body;
  const product = await Product.findById(productID);

  const { ratingsAndReviews } = product;
  const { ratingAndReview } = ratingsAndReviews;

  // Filter out the object with the specified userID
  const updatedRatingAndReview = ratingAndReview.filter(
    (review) => review.userId._id.toString() !== userID
  );

  // Update the ratingsAndReviews with the modified ratingAndReview array
  ratingsAndReviews.ratingAndReview = updatedRatingAndReview;

  // Save the changes to the product
  await product.save();

  res.status(200).json(ratingsAndReviews);
});

export {
  getProducts,
  getSingleProduct,
  addProduct,
  ratingsAndReviews,
  deleteRatingAndReview,
};
