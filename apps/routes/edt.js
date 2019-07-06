const router = require("express").Router();

router.get("/:edtID?", require("../controllers/edt_c"));

module.exports = router;