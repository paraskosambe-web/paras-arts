const router = require("express").Router();
const c = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.post("/", c.create);
router.get("/", protect, c.list);
router.patch("/:id/read", protect, c.markRead);
router.delete("/:id", protect, c.remove);

module.exports = router;
