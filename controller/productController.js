import Product from "../model/productSchema.js";

async function getProducts(req, res) {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    res.status(401).json(error);
  }
}

async function getSingleProduct(req, res) {
  try {
    const id = req.params.id;
    const data = await Product.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

export { getProducts, getSingleProduct };
