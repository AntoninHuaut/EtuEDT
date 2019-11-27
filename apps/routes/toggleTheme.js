const router = require("express").Router();

router.get("/", require("../controllers/toggleTheme_c"));

module.exports = router;