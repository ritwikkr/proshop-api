import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../model/orderSchema.js";

const createOrder = asyncHandler(async (req, res) => {
  const { orderDetails, userId, totalPrice, deliveryAddress } = req.body;
  const products = orderDetails.map((item) => {
    return { productId: item._id, price: item.price };
  });
  const shippingAddress = {
    name: deliveryAddress?.name,
    phoneNumber: deliveryAddress?.phoneNumber,
    address: deliveryAddress?.address,
    city: deliveryAddress?.city,
    state: deliveryAddress?.state,
    pinCode: deliveryAddress?.postal,
  };

  const data = await Order.create({
    products,
    userId,
    amount: totalPrice,
    shippingAddress,
  });
  res.status(200).json(data);
});

const getOrder = asyncHandler(async (req, res) => {
  const data = await Order.find({ userId: req.body.userId });
  res.status(200).json(data);
});

const deleteAllOrder = asyncHandler(async (req, res) => {
  const data = await Order.deleteMany();
  console.log(data);
});

// GET: Order ID for Order Details page
const getOrderByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  let order = await Order.findById(orderId).populate("products.productId");

  let orderObject = order.toObject();

  orderObject.products = orderObject.products.map((product) => {
    const { productId } = product;
    return {
      _id: productId._id,
      name: productId.name,
      image: productId.image,
      description: productId.description,
      brand: productId.brand,
      category: productId.category,
      price: product.price,
      countInStock: productId.countInStock,
      featured: productId.featured,
      ratingsAndReviews: productId.ratingsAndReviews,
    };
  });

  res.status(200).json(orderObject);
});

export { createOrder, getOrder, deleteAllOrder, getOrderByOrderId };
