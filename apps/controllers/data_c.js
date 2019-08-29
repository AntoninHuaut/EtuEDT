const edtManage = require('../utils/edtManage');

const typeList = {
    ID: "Id",
    NAME: "Name"
}

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    const edtType = isNaN(edtID) ? typeList.NAME : typeList.ID;
    const dataOnly = req.params.dataOnly == 'raw';
    const cache = edtManage.getAll();

    if (!Array.isArray(cache))
        return res.send(cache);

    if (!edtID)
        return res.send(edtManage.getEDTName());
    else if (edtType == typeList.NAME) {
        let el = cache.find(item => item.edtName.replace(/ /g, '_') == edtID);
        edtID = el ? cache.indexOf(el) : null;
    } else if (edtType == typeList.ID && !cache[edtID])
        edtID = null;

    if (edtID != null)
        res.send(dataOnly ? cache[edtID].edtData : cache[edtID]);
    else
        res.send({
            "error": "edt" + edtType + " does not exist"
        });
}