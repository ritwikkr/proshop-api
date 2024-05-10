import Wishlist from "../model/wishlistSchema.js";
import Products from "../model/productSchema.js";

// Get all wishlist items for a user
export const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.userData;
    const wishlistItems = await Wishlist.findOne({ userId });
    let data = [];
    if (wishlistItems)
      data = await Promise.all(
        wishlistItems.products.map(async (item) => {
          return await Products.findById(item);
        })
      );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist items", error: error.message });
  }
};

// Toggle an item to the wishlist
export const toggleWishlistItem = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { productId } = req.body;
    // Check if the item is already in the wishlist
    const existingItem = await Wishlist.findOne({
      userId,
      products: productId,
    });
    if (existingItem) {
      await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { products: productId } }
      );
      // Return the updated wishlist
      const updatedWishlist = await Wishlist.findOne({ userId });
      const products = await Promise.all(
        updatedWishlist.products.map(async (item) => {
          return await Products.findById(item);
        })
      );
      return res.status(200).json(products);
    }

    // Add the item to the wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $push: { products: productId } },
      { new: true, upsert: true }
    );

    const products = await Promise.all(
      wishlist.products.map(async (item) => {
        return await Products.findById(item);
      })
    );
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error adding/removing item to wishlist",
      error: error.message,
    });
  }
};
