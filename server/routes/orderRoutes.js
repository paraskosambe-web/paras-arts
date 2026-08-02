const router = require("express").Router();
const c = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", upload.single("referenceImage"), c.create);
router.get("/track", c.track);
router.get("/", protect, c.list);

router.get("/stats", protect, c.stats);
router.patch("/:id/status", protect, c.updateStatus);
router.delete("/:id", protect, c.remove);

module.exports = router;
