const Service = require("../models/Service");

exports.list = async (_req, res, next) => {
  try { res.json({ items: await Service.find().sort({ createdAt: 1 }) }); }
  catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Service.create(req.body)); }
  catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try {
    const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try {
    const s = await Service.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
