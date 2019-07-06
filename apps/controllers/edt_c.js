const apps = require('../apps.js');

module.exports = async function (req, res) {
    let edtID = req.params.edtID;

    if (!edtID) {
        res.sendFile(__basedir + '/static/edt.html');
        return;
    }

    let cache = apps.cache();

    if (!cache[edtID] || edtID == "count" || !req.cookies.edtCookie)
        res.redirect('/');
    else {
        let cookieValue = JSON.parse(req.cookies.edtCookie);
        cookieValue['edtID'] = edtID;
        res.cookie('edtCookie', JSON.stringify(cookieValue));
        res.redirect('/edt');
    }
}