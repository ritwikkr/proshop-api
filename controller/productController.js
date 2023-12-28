import Product from "../model/productSchema.js";
import User from "../model/userSchema.js";

async function getProducts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    const products = await Product.find().skip(skip).limit(pageSize);
    const totalCount = await Product.countDocuments();

    res.json({
      products,
      page,
      pageSize,
      totalCount,
    });
  } catch (error) {
    res.status(401).json(error);
  }
}

async function getSingleProduct(req, res) {
  try {
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
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function addProduct(req, res) {
  try {
    const data = await Product.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
  }
}

// GET: Featured Product
async function getFeaturedProduct(req, res) {
  try {
    const data = await Product.find({ featured: true });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

// POST: Give ratings
async function ratingsAndReviews(req, res) {
  try {
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

    console.log(updatedProduct.ratingsAndReviews);

    // Calculate the updated total ratings and update it in the product document
    updatedProduct.ratingsAndReviews.totalRatings =
      updatedProduct.ratingsAndReviews.ratingAndReview.length;

    await updatedProduct.save();

    res.status(200).json({
      success: true,
      message: "Rating added successfully",
      ratingsAndReviews: updatedProduct.ratingsAndReviews,
    });
  } catch (error) {
    res.status(400).json(error);
  }
}

// DELETE: Delete Ratings and review
async function deleteRatingAndReview(req, res) {
  try {
    const { productID, ratingID } = req.body;
    const product = await Product.findById(productID);

    const { ratingsAndReviews } = product;
    const { ratingAndReview } = ratingsAndReviews;

    // Filter out the object with the specified ratingID
    const updatedRatingAndReview = ratingAndReview.filter(
      (review) => review._id.toString() !== ratingID
    );

    // Update the ratingsAndReviews with the modified ratingAndReview array
    ratingsAndReviews.ratingAndReview = updatedRatingAndReview;

    // Save the changes to the product
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Ratings deleted successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
}

export {
  getProducts,
  getSingleProduct,
  addProduct,
  getFeaturedProduct,
  ratingsAndReviews,
  deleteRatingAndReview,
};
