const router = require("express").Router();
const controller = require("../controllers/edt_c");

router.get("/edtData/:edtID?", controller.edtData);
router.get("/:edtID?", controller.showEDT);

module.exports = router;