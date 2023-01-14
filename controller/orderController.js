import Order from "../model/orderSchema.js";

function getKey(req, res) {
  try {
    res.send({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.log(error);
  }
}

async function createOrder(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).json({ msg: "Some error occured" });
  } catch (error) {
    console.log(error);
  }
}

async function payOrder(req, res) {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    await Order.create({
      isPaid: true,
      amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });
    res.json({ msg: "Payment was successfull" });
  } catch (error) {
    console.log(error);
  }
}

export { getKey, createOrder, payOrder };
