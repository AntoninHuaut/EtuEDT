const edtManage = require('../utils/edtManage');

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    const format = req.params.format;
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

    if (format == 'ics') return res.send(item[0].edtData);
    if (format == 'json') return res.send(edtManage.toJson(item[0]));

    res.send(item[0]);
}