const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    answer: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "Commissions",
        "Materials & Delivery",
        "Payments & Revisions",
      ],
      default: "Commissions",
    },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", faqSchema);