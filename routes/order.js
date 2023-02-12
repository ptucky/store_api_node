const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAuth,
  verifyTokenOnlyAdmin,
} = require("./verifyToken");

// verifyToken
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req?.body);
  try {
    const addOrder = await newOrder.save();
    res.status(200).json(addOrder);
  } catch (err) {}
});

// verifyTokenOnlyAdmin
router.put("/:id", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req?.params?.id,
      {
        $set: req?.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateOrder);
  } catch (err) {}
});

// verifyTokenAuth
router.delete("/:id", verifyTokenAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req?.params?.id);
    res.status(200).json("Order was deleted!");
  } catch (err) {}
});

// verifyTokenAuth
router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req?.params?.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// verifyTokenOnlyAdmin
router.get("/", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ _id: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// verifyTokenOnlyAdmin
router.get("/income", verifyTokenOnlyAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const datas = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(datas);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
