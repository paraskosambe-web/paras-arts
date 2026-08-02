const Order = require("../models/Order");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.referenceImage = `/uploads/${req.file.filename}`;
    const order = await Order.create(data);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const search = (req.query.search || "").trim();
    const status = req.query.status;

    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (_req, res, next) => {
  try {
    const [pending, completed, total] = await Promise.all([
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Completed" }),
      Order.countDocuments({}),
    ]);
    res.json({ pending, completed, total });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.track = async (req, res, next) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    const id = String(req.query.id || "").trim();
    if (!email || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Valid email and order ID are required" });
    }
    const order = await Order.findOne({ _id: id, email: new RegExp(`^${email}$`, "i") }).select(
      "_id fullName status sketchType paperSize createdAt updatedAt"
    );
    if (!order) return res.status(404).json({ message: "No commission found for those details" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
