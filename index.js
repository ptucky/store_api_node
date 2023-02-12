const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection is connected");
  })
  .catch((err) => {
    console.log("Error");
  });

// CORS
app.use(cors());

// JSON
app.use(express.json());

// PUBLIC IMAGE
app.use(express.static("public"));
app.use("/images", express.static("images"));

// ROUTE
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 3003, () => {
  console.log(`Server is running port: ${process.env.PORT}`);
});
