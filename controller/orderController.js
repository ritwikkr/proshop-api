import Order from "../model/orderSchema.js";

async function createOrder(req, res) {
  try {
    const { orderDetails, userId, totalPrice, deliveryAddress } = req.body;
    const products = orderDetails.map((item) => {
      return { productId: item._id, price: item.price };
    });
    console.log("Delivery Address", deliveryAddress);
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
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getOrder(req, res) {
  try {
    const data = await Order.find({ userId: req.body.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteAllOrder(req, res) {
  try {
    const data = await Order.deleteMany();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

// GET: Order ID for Order Details page
async function getOrderByOrderId(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("products.productId");
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
}

export { createOrder, getOrder, deleteAllOrder, getOrderByOrderId };
