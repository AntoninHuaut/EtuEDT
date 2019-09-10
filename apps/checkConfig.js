/* On va éviter de se refaire ban le compte */
const config = require('./config.json');
const moment = require('moment');
const minMinsRefresh = 15;

module.exports = () => {
    if (!config.refreshMinuts || !Number.isInteger(config.refreshMinuts) || config.refreshMinuts < minMinsRefresh) {
        console.error(getDate(), `refreshMinuts (${ config.refreshMinuts}) should be greater than or equal to ${minMinsRefresh}`);
        process.exit();
    } else
        console.log(getDate(), "Timer OK");
}

function getDate() {
    return moment().format("DD/MM/YYYY HH:mm");
}