const router = require("express").Router();

router.get("/", require("../controllers/base_c").select);

module.exports = router;