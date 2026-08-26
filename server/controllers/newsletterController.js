const Newsletter = require("../models/Newsletter");

exports.subscribe = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email address is required",
      });
    }

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(409).json({
        message: "This email is already subscribed.",
      });
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      message: "Successfully subscribed.",
      subscriber,
    });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 });

    res.json(subscribers);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(
      req.params.id
    );

    if (!subscriber) {
      return res.status(404).json({
        message: "Subscriber not found",
      });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};