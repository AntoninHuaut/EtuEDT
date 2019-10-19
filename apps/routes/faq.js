const router = require("express").Router();

router.get("/", require("../controllers/faq_c"));

module.exports = router;