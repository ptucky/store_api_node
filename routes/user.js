const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAuth,
  verifyTokenOnlyAdmin,
} = require("./verifyToken");

// verifyTokenAuth
router.put("/:id", verifyTokenAuth, async (req, res) => {
  if (req?.body?.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req?.body?.password,
      process.env.SECRET_KEY
    ).toString();
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req?.params?.id,
      {
        $set: req?.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateUser);
  } catch (err) {}
});

// verifyTokenAuth
router.delete("/:id", verifyTokenAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.status(200).json("User was deleted!");
  } catch (err) {}
});

// Admin
router.get("/find/:id", verifyTokenOnlyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req?.params?.id);
    const { password, ...response } = user._doc;
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Admin
router.get("/", verifyTokenOnlyAdmin, async (req, res) => {
  const queryLimit = req?.query.limit;

  try {
    const users = queryLimit
      ? await await User.find({}, { password: 0 })
          .sort({ _id: -1 })
          .limit(queryLimit)
      : await User.find({}, { password: 0 }).sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Admin
router.get("/stats", verifyTokenOnlyAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const datas = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(datas);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
