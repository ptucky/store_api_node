const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAuth,
  verifyTokenOnlyAdmin,
} = require("./verifyToken");

// verifyToken
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req?.body);
  try {
    const addCart = await newCart.save();
    res.status(200).json(addCart);
  } catch (err) {}
});

// verifyToken
router.put("/:id", verifyTokenAuth, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req?.params?.id,
      {
        $set: req?.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateCart);
  } catch (err) {}
});

// verifyTokenAuth
router.delete("/:id", verifyTokenAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req?.params?.id);
    res.status(200).json("Cart was deleted!");
  } catch (err) {}
});

// verifyTokenAuth
router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req?.params?.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// verifyTokenOnlyAdmin
router.get("/", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    const carts = await Cart.find({}).sort({ _id: -1 });

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
