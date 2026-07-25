const router = require("express").Router();
const c = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", c.list);
router.post("/", protect, upload.single("image"), c.create);
router.put("/:id", protect, upload.single("image"), c.update);
router.delete("/:id", protect, c.remove);

module.exports = router;
