const express = require("express");
const router = express.Router();
const base_c = require('../controllers/base_c');

router.use((req, res, next) => {
    if (!req.session) req.session = {};
    if (!req.session.options) {
        req.session.options = {};

        base_c.getOptions().forEach(opt => req.session.options[opt] = true);
    }

    next();
});

router.use("/data", require("./data"));
router.use("/edt", require("./edt"));
router.use("/", require("./base"));
router.use(express.static('apps/static'));

module.exports = router;