const sql = require('./index');

exports.getAllEDT = () => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`select * from EDT join Etablissement using(numEta) order by numEta, numAnnee, numTP`, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        con.end();
    });
}