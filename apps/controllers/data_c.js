const edtManage = require('../utils/edtManage');

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    const icsOnly = req.params.format == 'ics';
    const cache = edtManage.getAll();

    if (!Array.isArray(cache))
        return res.send(cache);

    if (!edtID)
        return res.send(edtManage.getEDTInfos());

    let item = cache.filter(item => item.edtId == edtID);
    if (!item || item.length == 0)
        return res.send({
            "error": `edtId ${edtID} does not exist`
        });

    res.send(icsOnly ? item[0].edtData : item[0]);
}