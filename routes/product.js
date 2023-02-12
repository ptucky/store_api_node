const router = require("express").Router();
const Product = require("../models/Product");
const {
  // verifyToken,
  // verifyTokenAuth,
  verifyTokenOnlyAdmin,
} = require("./verifyToken");

router.post("/", verifyTokenOnlyAdmin, async (req, res) => {
  const newProduct = new Product(req?.body);
  try {
    const addProduct = await newProduct.save();
    res.status(200).json(addProduct);
  } catch (err) {}
});

router.put("/:id", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req?.params?.id,
      {
        $set: req?.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateProduct);
  } catch (err) {}
});

router.delete("/:id", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req?.params?.id);
    res.status(200).json("Product was deleted!");
  } catch (err) {}
});

// router.get("/find/:id", verifyTokenOnlyAdmin, async (req, res) => {
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/", verifyTokenOnlyAdmin, async (req, res) => {
router.get("/", async (req, res) => {
  const queryLimit = req?.query?.limit;
  const queryCategory = req?.query?.category;
  const querySort = req?.query?.sorting;

  try {
    let products;

    if (queryLimit) {
      products = await Product.find({}).sort({ _id: -1 }).limit(queryLimit);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      }).sort({ _id: -1 });
    } else if (querySort) {
      const orderBy = querySort === "desc" ? { _id: -1 } : { _id: 1 };
      products = await Product.find().sort(orderBy);
    } else {
      products = await Product.find({}).sort({ _id: -1 });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
