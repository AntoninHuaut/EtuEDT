const express = require("express");
const router = express.Router();
const base_c = require('../controllers/base_c');
const edtManage = require('../utils/edtManage');
const cors = require('cors')

router.use(express.static('apps/static'));

router.use((req, res, next) => {
    if (!req.session) req.session = {};
    if (!req.session.options) {
        req.session.options = {};
        base_c.getOptions().forEach(opt => req.session.options[opt] = true);
    }

    if (!req.session.darkTheme) req.session.darkTheme = false;

    next();
});

router.use("/", require("./base"));
router.use("/toggleTheme", cors(), require("./toggleTheme"));
router.use("/data", cors(), require("./data"));
router.use("/faq", require("./faq"));
router.use("/option", cors(), require("./option"));

router.use((req, res, next) => {
    if (!Array.isArray(edtManage.getAll())) return res.redirect('/');

    next();
});

router.use("/edt", require("./edt"));

module.exports = router;