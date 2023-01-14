import Product from "../model/productSchema.js";

async function createProduct(req, res) {
  try {
    // products.map(async (product) => {
    //   delete product._id;
    //   const productres = await Product.create(product);
    //   console.log(productres);
    // });
    // console.log(products[0]);
    // res.json(product);
    // res.json(req.body);
    // console.log(product);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
}

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
    console.log(error);
  }
}

export { createProduct, getProducts, getSingleProduct };
