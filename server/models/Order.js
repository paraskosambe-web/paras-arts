const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: String, default: "" },

    whatsapp: { type: String, default: "" },

    address: { type: String, default: "" },

    country: { type: String, default: "" },

    sketchType: { type: String, default: "Custom Portrait" },

    paperSize: { type: String, default: "A3" },

    budget: { type: Number, default: 0 },

    preferredDate: { type: Date },

    referenceImage: { type: String, default: "" },

    notes: { type: String, default: "" },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Verified"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);