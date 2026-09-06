const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priceFrom: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    icon: {
      type: String,
      default: "Brush",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    delivery: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);