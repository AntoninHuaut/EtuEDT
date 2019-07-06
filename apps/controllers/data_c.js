const apps = require('../apps.js');

module.exports = async function (req, res) {
    let edtID = req.params.edtID;
    let dataOnly = req.params.dataOnly;
    let edtIDType = isNaN(edtID) ? 'edtName' : 'edtID';
    let cache = apps.cache();
    dataOnly = !dataOnly ? false : dataOnly.toLowerCase() == 'raw';

    if (!edtID) {
        let tmpCache = JSON.parse(JSON.stringify(cache));
        for (let i = 0; i < tmpCache.count; i++) {
            delete tmpCache[i].lastUpdate;
            delete tmpCache[i].edtData;
        }
        res.send(tmpCache);
        return;
    } else if (edtIDType == 'edtName') {
        if (edtID != "count")
            for (let i = 0; i < cache.count; i++)
                if (cache[i].edtName.replace(/ /g, '_') == edtID) {
                    edtID = i;
                    break;
                }

        if (isNaN(edtID))
            edtID = -1;
    } else if (edtIDType == 'edtID' && !cache[edtID])
        edtID = -1;

    if (edtID != -1)
        res.send(dataOnly ? cache[edtID].edtData : cache[edtID]);
    else
        res.send('{"error": "' + edtIDType + ' does not exist"}');
}