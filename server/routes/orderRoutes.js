const router = require("express").Router();

const c = require("../controllers/orderController");

const { protect } = require("../middleware/auth");

const upload = require("../middleware/upload");

router.post("/", upload.single("referenceImage"), c.create);

router.get("/track", c.track);

// Customer reports that they have paid
router.patch("/:id/payment", c.markPaid);

// Admin routes
router.get("/", protect, c.list);

router.get("/stats", protect, c.stats);

router.patch("/:id/status", protect, c.updateStatus);

// Admin verifies the customer's payment
router.patch("/:id/verify-payment", protect, c.verifyPayment);

router.delete("/:id", protect, c.remove);

module.exports = router;