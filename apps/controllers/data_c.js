const edtManage = require('../utils/edtManage');
const FORMAT = {
    ics: "ics",
    json: "json"
}

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    const format = req.params.format;
    const validFormat = isValidFormat(format);
    const cacheAll = edtManage.getAll();

    if (!Array.isArray(cacheAll))
        return res.send(cacheAll);

    const cacheUse = !!edtID && validFormat ? cacheAll : edtManage.getEDTInfos();

    if (!edtID)
        return res.send(cacheUse);

    let item = cacheUse.filter(subItem => subItem.edtId == edtID);
    if (item.length == 0)
        return res.send({
            "error": `edtId ${edtID} does not exist`
        });

    if (validFormat) {
        if (format == FORMAT.ics) return res.send(item[0].getICS());
        if (format == FORMAT.json) return res.send(item[0].getJSON());
    }

    res.send(item[0]);
}

function isValidFormat(format) {
    return FORMAT.hasOwnProperty(format);
}