const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Portrait", "Couple", "Family", "Pet", "Automotive", "Other"],
      default: "Portrait",
    },
    medium: { type: String, default: "Graphite on Archival Paper" },
    paperSize: { type: String, default: "A3 · 297 × 420 mm" },
    description: { type: String, default: "" },
    image: { type: String, required: true }, // relative URL e.g. /uploads/xyz.jpg
    price: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
