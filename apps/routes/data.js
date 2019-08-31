const router = require("express").Router();

router.get("/:edtID?/:format?", require("../controllers/data_c"));

module.exports = router;