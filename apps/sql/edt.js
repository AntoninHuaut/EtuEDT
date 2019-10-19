const sql = require('./index');

exports.getAllEDT = () => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`select * from EDT join Universite using(numUniv) order by numUniv, numAnnee, numTP`, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        con.end();
    });
}