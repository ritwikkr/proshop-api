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
    console.log(id);
    const data = await Product.findById(id);
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

export { getProducts, getSingleProduct };
