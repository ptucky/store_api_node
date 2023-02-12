const { Double } = require("bson");
const mongoose = require("mongoose");
const { boolean, float } = require("webidl-conversions");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        // price: {
        //   type: Number, // Double
        // },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
