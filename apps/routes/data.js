const router = require("express").Router();

router.get("/:edtID?/:dataOnly?", require("../controllers/data_c"));

module.exports = router;