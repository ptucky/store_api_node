const { Double } = require("bson");
const mongoose = require("mongoose");
const { boolean, float } = require("webidl-conversions");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, require: true },
    price: { type: Number, require: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    // size: { type: String },
    // color: { type: String },
    // discount_percentage: { type: Double },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
