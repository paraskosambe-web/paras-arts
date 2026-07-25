const Testimonial = require("../models/Testimonial");

exports.list = async (_req, res, next) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const t = await Testimonial.create(data);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const t = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
