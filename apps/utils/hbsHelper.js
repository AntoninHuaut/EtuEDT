const hbs = require('express-hbs');

module.exports = () => {
    hbs.registerHelper('isEquals', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
}