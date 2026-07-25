const fs = require("fs");
const path = require("path");
const Artwork = require("../models/Artwork");

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 12, 100);
    const search = (req.query.search || "").trim();
    const category = req.query.category;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;

    const [items, total] = await Promise.all([
      Artwork.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Artwork.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });
    res.json(art);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (!data.image) return res.status(400).json({ message: "Image is required" });
    const art = await Artwork.create(data);
    res.status(201).json(art);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const art = await Artwork.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!art) return res.status(404).json({ message: "Artwork not found" });
    res.json(art);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const art = await Artwork.findByIdAndDelete(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });
    if (art.image && art.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", art.image);
      fs.promises.unlink(filePath).catch(() => {});
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
