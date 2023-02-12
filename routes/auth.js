const router = require("express").Router();
const User = require("../models/User");
const { route } = require("./user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/**
 * Register
 */
router.post("/register", async (req, res) => {
  if (!req?.body?.email) {
    res.status(400).json("Require Email!");
  }

  if (!req?.body?.password) {
    res.status(400).json("Require Password!");
  }

  const hashPassword = CryptoJS.AES.encrypt(
    req?.body?.password,
    process.env.SECRET_KEY
  ).toString();

  const newUser = new User({
    username: req?.body?.username,
    email: req?.body?.email,
    password: hashPassword,
  });

  try {
    const saveUser = await newUser.save();

    // remove password
    const { password, ...response } = saveUser._doc;

    res.status(201).json({
      code: 201,
      message: "Success",
      data: response,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Login
 */
router.post("/login", async (req, res) => {
  try {
    const verifyUser = await User.findOne(
      { email: req?.body?.email },
      { _id: 1, email: 1, isAdmin: 1, password: 1 }
    );

    !verifyUser &&
      res.status(401).json({
        code: 401,
        message: "This user not exist!",
      });

    const hashedPassword = CryptoJS.AES.decrypt(
      verifyUser.password,
      process?.env?.SECRET_KEY
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req?.body?.password &&
      res.status(401).json({
        code: 401,
        message: "Incorrect password!",
      });

    const accessToken = jwt.sign(
      {
        id: verifyUser._id,
        isAdmin: verifyUser.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password, ...response } = verifyUser._doc; // remove password
    res.status(200).json({
      code: 200,
      message: "Success",
      data: { ...response, accessToken },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
