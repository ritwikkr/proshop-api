import Order from "../model/orderSchema.js";

async function createOrder(req, res) {
  try {
    const { orderDetails, userId, totalPrice } = req.body;
    const products = orderDetails.map((item) => {
      return { productId: item._id, price: item.price };
    });
    const data = await Order.create({ products, userId, amount: totalPrice });
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

export { createOrder, getOrder, deleteAllOrder };
