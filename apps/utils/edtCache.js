const async = require('async');
const request = require("request");
const config = require('../config');
const regexCString = new RegExp('\\?\\?', 'g');

module.exports = class EDTCache {
    constructor() {
        this.refreshInterval = setInterval(() => this.refresh, 15 * 60 * 1000);
        this.cached = JSON.parse('{"error": "Initialization has not yet been performed"}');
        this.cachedName = [];
        this.init = false;
        this.refresh();
    }

    isInit() {
        return this.init;
    }

    getAll() {
        return this.cached;
    }

    getEDTName() {
        return this.init ? this.cachedName : this.cached;
    }

    refresh() {
        let tmpCache = [];
        let date = new Date();

        async.map(config.edt, httpGet, (err, res) => {
            if (err) return console.log(err);

            for (let i = 0; i < res.length; i++)
                if (res[i].includes('HTTP ERROR') && !!this.cached[i] && this.cached[i].hasOwnProperty("edtData"))
                    tmpCache[i] = this.cached[i];
                else
                    tmpCache.push(new EDT(config.edt[i].name, date, res[i]));

            this.cached = tmpCache;
            this.cachedName = this.cached.map(item => item.edtName);
            this.init = true;
        });
    }
}

class EDT {
    constructor(edtName, lastUpdate, edtData) {
        this.edtName = edtName;
        this.lastUpdate = lastUpdate;
        this.edtData = edtData;
    }
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