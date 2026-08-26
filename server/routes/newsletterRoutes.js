const router = require("express").Router();

const c = require("../controllers/newsletterController");
const { protect } = require("../middleware/auth");

router.post("/", c.subscribe);

router.get("/", protect, c.list);

router.delete("/:id", protect, c.remove);

module.exports = router;