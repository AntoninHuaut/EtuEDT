const express = require("express");
const router = express.Router();

router.use("/data", require("./data"));
router.use("/edt", require("./edt"));
router.use("/", require("./base"));
router.use(express.static('apps/static'));

module.exports = router;