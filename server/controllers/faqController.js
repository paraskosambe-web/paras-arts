const Faq = require("../models/Faq");

exports.list = async (_req, res, next) => {
  try { res.json({ items: await Faq.find().sort({ order: 1, createdAt: 1 }) }); }
  catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Faq.create(req.body)); }
  catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try {
    const f = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!f) return res.status(404).json({ message: "Not found" });
    res.json(f);
  } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try {
    const f = await Faq.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
