const edtManage = require('../utils/edtManage');
const moment = require('moment');;

exports.edtData = async function (req, res) {
    let edtID = req.params.edtID || req.session.edtID || null;

    res.send({
        edtID: edtID,
        options: req.session.options || null
    })
}

exports.showEDT = async function (req, res) {
    let edtID = req.params.edtID || req.session.edtID;
    const cache = edtManage.getAll();

    let item = cache.filter(item => item.edtId == edtID);
    if (!item || item.length == 0) return res.redirect('/');

    req.session.edtID = edtID;

    let time = moment(item[0].lastUpdate);

    res.render('edt', {
        edtID: req.session.edtID,
        edtInfos: {
            edtName: item[0].edtName,
            updateInfosD: time.format('DD/MM/YYYY'),
            updateInfosH: time.format('HH[h]mm')
        },
        darkTheme: req.session.darkTheme
    });
}