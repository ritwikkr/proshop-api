import Product from "../model/productSchema.js";

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
    const data = await Product.findById(id);
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

export { getProducts, getSingleProduct, addProduct, getFeaturedProduct };
