const async = require('async');
const request = require("request");
const config = require('../config');
const regexCString = new RegExp('\\?\\?', 'g');
const ICAL = require('ical.js');

module.exports = class EDTCache {
    constructor() {
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
        let cacheRefresh = this.init ? this.cached : [];
        let date = new Date();

        async.map(config.edt, httpGet, (err, res) => {
            if (err) return console.log(err);

            for (let i = 0; i < res.length; i++) {
                if (cacheRefresh[i]) {
                    if (res[i].includes('HTTP ERROR') && cacheRefresh[i].hasOwnProperty("edtIcs")) {
                        cacheRefresh[i] = this.cached[i];
                        continue;
                    }

                    let item = cacheRefresh.find(item => item.edtId == config.edt[i].account);
                    if (!item) continue;

                    item.lastUpdate = date;
                    item.edtIcs = res[i];
                    item.setJSON();
                } else
                    cacheRefresh.push(new EDT(config.edt[i].account, config.edt[i].name, date, res[i]));
            }

            this.cached = cacheRefresh;
            this.cachedInfos = this.cached.map(item => {
                return {
                    "edtId": item.edtId,
                    "edtName": item.edtName,
                    "lastUpdate": item.lastUpdate
                };
            });
            this.init = true;
        });
    }
}

class EDT {
    constructor(edtId, edtName, lastUpdate, edtIcs) {
        this.edtId = edtId;
        this.edtName = edtName;
        this.lastUpdate = lastUpdate;
        this.edtIcs = edtIcs;
        this.setJSON();
    }

    getICS() {
        return this.edtIcs;
    }

    getJSON() {
        return this.edtJson;
    }

    setJSON() {
        this.edtJson = this.toJson();
    }

    toJson() {
        if (!this.edtIcs || this.edtIcs.includes('HTTP ERROR')) return {
            "error": this.edtId + " not available"
        };

        let eventComps = new ICAL.Component(ICAL.parse(this.edtIcs.trim())).getAllSubcomponents("vevent");

        let events = eventComps.map(function (item) {
            if (item.getFirstPropertyValue("class") != "PUBLIC")
                return null;
            else {
                if (!hasValue(item) || getValue(item, 'description').split('\n').length < 5) return null;
                return {
                    "title": getValue(item, 'summary'),
                    "enseignant": getValue(item, 'description').split('\n')[4].replace('Enseignant : ', ''),
                    "start": getValue(item, 'dtstart').toJSDate(),
                    "end": getValue(item, 'dtend').toJSDate(),
                    "location": getValue(item, '"location')
                };
            }
        });

        return events.filter(el => el != null);
    }
}

function getValue(item, value) {
    return item.getFirstPropertyValue(value);
}

function hasValue(item) {
    return !!getValue(item, 'summary') &&
        !!getValue(item, 'description') &&
        !!getValue(item, 'dtstart') &&
        !!getValue(item, 'dtend') &&
        !!getValue(item, 'location');
}

function httpGet(confEl, callback) {
    const options = {
        method: 'GET',
        url: `https://webmail.unicaen.fr/home/${confEl.account}@etu.unicaen.fr/${confEl.edt}`,
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

    for (let i = 0; i < splited.length; i++)
        if (splited[i].startsWith('\nSUMMARY:') && splited[i].toLowerCase().includes('_s'))
            splited[i] = splited[i].substring(0, splited[i].toLowerCase().indexOf('_s'));

    str = splited.join('');

    return str.replace(regexCString, 'e');
}