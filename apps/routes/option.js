const router = require("express").Router();
const controller = require("../controllers/option_c");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.post("/selectOptions", urlencodedParser, controller.selectOptions);

module.exports = router;