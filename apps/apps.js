const web = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const config = require("./config.json");

var cache = JSON.parse('{"error": "Initialization has not yet been performed"}');
global.__basedir = __dirname;

web.use(bodyParser.json());
web.use(cookieParser());
web.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
web.use(require("./routes"));

web.listen(config.port, () => {
    console.log("Express port : " + config.port);
});

exports.cache = () => {
    return cache;
};

exports.setCache = newCache => {
    cache = newCache;
}

require('./utils/refreshEDT');