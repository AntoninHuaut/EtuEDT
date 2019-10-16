const hbs = require('express-hbs');
const web = require("express")();
const bodyParser = require("body-parser");
const session = require('express-session');
const config = require("./config.json");
const uuidv4 = require('uuid/v4');
const path = require('path');
require('dotenv').config();

global.__basedir = __dirname;

web.use(require('helmet')());
web.use(bodyParser.urlencoded({
    extended: true
}));
web.use(bodyParser.json());

web.engine('hbs', hbs.express4({
    partialsDir: path.join(__basedir, '/views/partials'),
    // layoutsDir: path.join(__basedir, '/views/layouts'),
    // defaultLayout: path.join(__basedir, "/views/layouts/main"),
}));
web.set('view engine', 'hbs');
web.set('views', path.join(__basedir, '/views/layouts'));
// web.set('views', path.join(__basedir, '/views/pages'));

var cookieData = {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
};

if (process.env.NODE_ENV === 'production') {
    web.set('trust proxy', 1);
    cookieData.secure = true;
}

web.use(session({
    genid: () => {
        return uuidv4();
    },
    secret: config.sessionSecret,
    name: "etuedt_session",
    saveUninitialized: false,
    resave: true,
    proxy: true,
    cookie: cookieData
}));

web.use(require("./routes"));

web.listen(config.port, () => {
    console.log("Express port : " + config.port);
});