const fs = require('fs');
const moment = require('moment');
const path = require('path');

process.on('uncaughtException', (err) => log("uncaughtException", err));
process.on('unhandledRejection', (reason) => log("unhandledRejection", reason));

async function log(type, err) {
    const folder = path.join(__basedir + '/logs/');
    fs.mkdirSync(folder, {
        recursive: true
    });

    const fileDate = moment().format('DD_MM_YYYY__HH_mm_ss');
    const normalDate = moment().format('DD/MM/YYYY HH[:]mm[:]ss');
    const fileName = `crash_${type}__${fileDate}.txt`;
    const content = `DATE : ${normalDate}
    \nTYPE : ${type}
    \n${err.stack}`;

    console.log(`${normalDate} Error: ${type}`)
    fs.writeFileSync(path.join(folder + fileName), content);
}