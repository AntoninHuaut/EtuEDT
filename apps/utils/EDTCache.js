const async = require('async');
const fetch = require("node-fetch");
const moment = require("moment");
const config = require('../config');
const sql = require('../sql');
const EDT = require('./EDT');

const NB_WEEKS = 52;

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
            .then(edtList => {
                const rqList = edtList.map(edt => requestEdt(edt));

                Promise.all(rqList)
                    .then(res => {
                        res = res.map(res => convertString(res));
                        this.updateEdt(edtList, res);
                    })
                    .catch(err => console.error(now(), "[Catch]", err));
            });
    }

    updateEdt(edtList, res) {
        let cacheRefresh = this.init ? this.cached : [];
        let date = new Date();
        let ignoreOldEntries = [];

        for (let i = 0; i < res.length; i++) {
            ignoreOldEntries.push(edtList[i].resources);
            let item = cacheRefresh.find(item => item.edtId == edtList[i].resources);

            if (!!item) {
                if (!res[i].includes('HTTP ERROR')) {
                    item.lastUpdate = date;
                    item.edtIcs = res[i];
                    item.setJSON();
                }
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

function requestEdt(edtSql) {
    const url = edtSql.adeEta.replace("{resources}", edtSql.resources).replace("{projectId}", edtSql.projectId).replace("{nbWeeks}", NB_WEEKS);
    const params = new URLSearchParams({
        calType: 'ical',
        nbWeeks: NB_WEEKS
    });

    return fetch(url + '&' + params).then(res => res.text());
}

function convertString(str) {
    if (!str)
        return str;

    const splited = str.split('\r');

    for (let i = 0; i < splited.length; i++) {
        splited[i] = convertStringSplit(splited, i, '_s');
        splited[i] = convertStringSplit(splited, i, '_1');
        splited[i] = convertStringSplit(splited, i, '_2');
    }

    str = splited.join('');

    return str;
}

function convertStringSplit(splited, i, strSplit) {
    if (splited[i].startsWith('\nSUMMARY:') && splited[i].toLowerCase().includes(strSplit))
        return splited[i].substring(0, splited[i].toLowerCase().indexOf(strSplit));

    return splited[i];
}

function now() {
    return moment().format("DD/MM/YYYY HH:mm");
}