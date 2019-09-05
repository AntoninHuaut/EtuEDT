const router = require("express").Router();
const controller = require("../controllers/edt_c");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.post("/selectEDT", urlencodedParser, controller.selectEDT);
router.get("/edtData", controller.edtData);
router.get("/:edtID?", controller.showEDT);

module.exports = router;