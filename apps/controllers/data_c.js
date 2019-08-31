const edtManage = require('../utils/edtManage');

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    const dataOnly = req.params.dataOnly == 'raw';
    const cache = edtManage.getAll();

    if (!Array.isArray(cache))
        return res.send(cache);

    if (!edtID)
        return res.send(edtManage.getEDTNameWId());

    let item = cache.filter(item => item.edtId == edtID);
    if (!item || item.length == 0)
        return res.send({
            "error": `edtId ${edtID} does not exist`
        });

    res.send(dataOnly ? item[0].edtData : item[0]);
}