const mysql = require('mysql');
const config = require('../config.json');
const fs = require('fs');
const readline = require('readline');

function initTable() {
    let rl = readline.createInterface({
        input: fs.createReadStream('./apps/sql/table.sql'),
        terminal: false
    });
    let con = this.getConnection();
    rl.on('line', chunk => con.query(chunk.toString('utf-8'), (err) => {}));
    rl.on('close', () => con.end());
}

exports.getOptions = () => {
    return {
        host: config.sql.host,
        port: config.sql.port,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database
    };
}
exports.initTable = initTable;
exports.getConnection = () => {
    let con = mysql.createConnection(this.getOptions());
    con.connect();
    return con;
};

const edtSQL = require('./edt');
exports.getAllEDT = edtSQL.getAllEDT;