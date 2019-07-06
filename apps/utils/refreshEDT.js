const async = require('async');
const request = require("request");
const apps = require('../apps');
const config = require('../config.json');
const regexCString = new RegExp('\\?\\?', 'g');

reloadEDT();
setInterval(reloadEDT, 15 * 60 * 1000);

function reloadEDT() {
    let cache = apps.cache;

    let tmpCache = {
        count: 0
    };

    let date = new Date();

    async.map(config.edt, httpGet, function (err, res) {
        if (err) return console.log(err);

        for (let i = 0; i < res.length; i++) {
            tmpCache.count += 1;

            if (res[i].includes('HTTP ERROR') && !!cache[i] && cache[i].hasOwnProperty("edtData"))
                tmpCache[i] = cache[i];
            else
                tmpCache[i] = {
                    'edtName': config.edt[i].name,
                    'lastUpdate': date,
                    'edtData': res[i]
                };
        }

        apps.setCache(tmpCache);
    });
}

function httpGet(confEl, callback) {
    const options = {
        method: 'GET',
        url: 'https://webmail.unicaen.fr/home/' + confEl.account + '/Emploi%20du%20temps',
        headers: {
            "Authorization": confEl.basicToken
        },
        qs: {
            auth: 'ba',
            fmt: 'ics'
        }
    };
    request(options,
        function (err, res, body) {
            callback(err, convertString(body));
        }
    );
}

function convertString(str) {
    if (!str)
        return str;

    str = str.replace(/Amphith\?\?\?\?tre/g, 'Amphi');
    let splited = str.split('\r');

    for (let i = 0; i < splited.length; i++)
        if (splited[i].startsWith('\nSUMMARY:') && splited[i].toLowerCase().includes('_s'))
            splited[i] = splited[i].substring(0, splited[i].toLowerCase().indexOf('_s'));

    str = splited.join('');

    return str.replace(regexCString, 'e');
}