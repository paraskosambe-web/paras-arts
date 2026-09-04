const Order = require("../models/Order");
const { sendOrderStatusEmail } = require("../services/emailService");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Generate a unique Paras Arts Order ID
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `PA-${yyyy}${mm}${dd}-${randomNumber}`;

    data.orderId = orderId;

    if (req.file) {
      data.referenceImage = `/uploads/${req.file.filename}`;
    }

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

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Order.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
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

    res.json({
      pending,
      completed,
      total,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Find the existing order first so we can compare the old status
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const oldStatus = order.status;

    // Update the order status
    order.status = status;
    await order.save();

    // Send email only when the status actually changes
    if (oldStatus !== status) {
      sendOrderStatusEmail(order, status).catch((emailError) => {
        console.error(
          `Failed to send status email for ${order.orderId}:`,
          emailError.message
        );
      });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.track = async (req, res, next) => {
  try {
    const email = String(req.query.email || "")
      .trim()
      .toLowerCase();

    const orderId = String(req.query.orderId || "")
      .trim()
      .toUpperCase();

    if (!email || !orderId) {
      return res.status(400).json({
        message: "Email and Order ID are required",
      });
    }

    const order = await Order.findOne({
      orderId,
      email: new RegExp(`^${email}$`, "i"),
    }).select(
      "orderId fullName status paymentStatus sketchType paperSize createdAt updatedAt"
    );

    if (!order) {
      return res.status(404).json({
        message: "No commission found for those details",
      });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.markPaid = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Payment marked as paid",
      orderId: order.orderId,
      paymentStatus: order.paymentStatus,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Verified" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Payment verified successfully",
      orderId: order.orderId,
      paymentStatus: order.paymentStatus,
    });
  } catch (err) {
    next(err);
  }
};