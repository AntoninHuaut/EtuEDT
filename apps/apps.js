const hbs = require('express-hbs');
const web = require("express")();
const bodyParser = require("body-parser");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const config = require("./config.json");
const uuidv4 = require('uuid/v4');
const path = require('path');
const swStats = require('swagger-stats');
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

web.use(swStats.getMiddleware({
    uriPath: '/metrics',
    authentication: true,
    onAuthenticate: function (req, username, password) {
        return ((username === config.swagger.username) && (password === config.swagger.password));
    }
}));

var cookieData = {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 2.592e+9 // 1 mois
};

if (process.env.NODE_ENV === 'production') {
    web.set('trust proxy', 1);
    cookieData.secure = true;
}

var sessionStore = new MySQLStore(require('./sql').getOptions());

web.use(session({
    genid: () => {
        return uuidv4();
    },
    secret: config.sessionSecret,
    name: "etuedt_session",
    saveUninitialized: false,
    store: sessionStore,
    resave: true,
    proxy: true,
    cookie: cookieData
}));

web.use(require("./routes"));

web.listen(config.port, () => {
    console.log("Express port : " + config.port);
});