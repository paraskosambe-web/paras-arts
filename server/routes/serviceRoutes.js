const router = require("express").Router();
const c = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

router.get("/", c.list);
router.post("/", protect, c.create);
router.put("/:id", protect, c.update);
router.delete("/:id", protect, c.remove);

module.exports = router;
