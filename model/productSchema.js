import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    featured: { type: Boolean, required: true, default: false },
    countInStock: { type: Number, required: true, default: 1 },
    ratingsAndReviews: {
      totalRatings: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      ratingAndReview: [
        {
          userId: {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "User",
            },
            name: { type: String, required: true },
          },
          ratings: { type: Number, required: true },
          review: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

// Calculate the averageRatings based on ratingAndReview entries
productSchema.pre("save", function (next) {
  const totalReviewsCount = this.ratingsAndReviews.ratingAndReview.length;
  this.ratingsAndReviews.totalReviews = totalReviewsCount;

  if (totalReviewsCount > 0) {
    const totalRatingsCount = this.ratingsAndReviews.ratingAndReview.reduce(
      (acc, review) => acc + review.ratings,
      0
    );
    this.ratingsAndReviews.totalRatings = parseFloat(
      totalRatingsCount / totalReviewsCount
    ).toFixed(1);
  } else {
    this.ratingsAndReviews.totalRatings = 0;
  }

  next();
});

export default mongoose.model("Product", productSchema);
