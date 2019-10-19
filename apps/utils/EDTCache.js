const async = require('async');
const request = require("request");
const moment = require("moment");
const config = require('../config');
const sql = require('../sql');
const EDT = require('./EDT');
const regexCString = new RegExp('\\?\\?', 'g');

module.exports = class EDTCache {
    constructor() {
        require('../checkConfig')();
        this.refreshInterval = setInterval(() => this.refresh(), config.refreshMinuts * 60 * 1000);

        this.cached = {
            "error": "Initialization has not yet been performed"
        };
        this.cachedInfos = [];
        this.init = false;
        this.refresh();
    }

    isInit() {
        return this.init;
    }

    getAll() {
        return this.cached;
    }

    getEDTInfos() {
        return this.init ? this.cachedInfos : this.cached;
    }

    refresh() {
        console.log(now(), "Refresh EDT...");

        sql.getAllEDT()
            .catch(err => console.error(err))
            .then(edtList => async.map(edtList, httpGet, (err, res) => this.httpRes(err, res, edtList)));
    }

    httpRes(err, res, edtList) {
        if (err) return console.error(now(), err);

        let cacheRefresh = this.init ? this.cached : [];
        let date = new Date();
        let ignoreOldEntries = [];

        for (let i = 0; i < res.length; i++) {
            ignoreOldEntries.push(edtList[i].etupass);
            let item = cacheRefresh.find(item => item.edtId == edtList[i].etupass);

            if (!!item) {
                if (!res[i].includes('HTTP ERROR'))
                    item.lastUpdate = date;

                item.edtIcs = res[i];
                item.setJSON();
            } else
                cacheRefresh.push(new EDT(edtList[i], date, res[i]));
        }

        console.log(now(), "Refresh EDT Terminé");

        cacheRefresh = cacheRefresh.filter(item => ignoreOldEntries.includes(item.edtId));

        this.cached = cacheRefresh;
        this.cachedInfos = this.cached.map(item => item.getAPIData());
        this.init = true;
    }
}

function httpGet(edtSql, callback) {
    const options = {
        method: 'GET',
        url: edtSql.zimbraUniv.replace("${etupass}", config.mainAccount).replace("${nomEDT}", edtSql.nomEDT),
        headers: {
            "Authorization": config.accountToken
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

    for (let i = 0; i < splited.length; i++) {
        splited[i] = convertStringSplit(splited, i, '_s');
        splited[i] = convertStringSplit(splited, i, '_1');
        splited[i] = convertStringSplit(splited, i, '_2');
    }

    str = splited.join('');

    return str.replace(regexCString, 'e');
}

function convertStringSplit(splited, i, strSplit) {
    if (splited[i].startsWith('\nSUMMARY:') && splited[i].toLowerCase().includes(strSplit))
        return splited[i].substring(0, splited[i].toLowerCase().indexOf(strSplit));

    return splited[i];
}

function now() {
    return moment().format("DD/MM/YYYY HH:mm");
}