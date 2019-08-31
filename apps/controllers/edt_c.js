const edtManage = require('../utils/edtManage');
const moment = require('moment');;

exports.edtData = async function (req, res) {
    res.send({
        edtID: req.session.edtID == null ? null : req.session.edtID,
        options: req.session.options || null
    })
}

exports.selectEDT = async function (req, res) {
    if (req.body.edtID == null || isNaN(req.body.edtID) || !req.body.options || !Array.isArray(req.body.options)) return res.status(400).send({
        error: "parameters errors"
    });

    req.body.options.forEach(item => req.session.options[item.opt] = item.checked);
    req.session.edtID = req.body.edtID;
    res.status(200).send({
        success: "200"
    });
}

exports.showEDT = async function (req, res) {
    let edtID = req.session.edtID;
    const cache = edtManage.getAll();

    let item = cache.filter(item => item.edtId == edtID);
    if (!item || item.length == 0) return res.redirect('/');

    res.render('edt', {
        noheader: true,
        edtName: item[0].edtName,
        edtId: edtID,
        lastUpdate: `Dernière update le ${moment(item[0].lastUpdate).format('DD/MM/YYYY à HH[h]mm')}`
    });
}