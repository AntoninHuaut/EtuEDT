const ICAL = require('ical.js');

module.exports = class EDT {
    constructor(edtData, lastUpdate, edtIcs) {
        this.numEta = edtData.numEta;
        this.nomEta = edtData.nomEta;
        this.numAnnee = edtData.numAnnee;
        this.numTP = edtData.numTP;
        this.nomEDT = edtData.nomEDT;
        this.edtName = this.numAnnee + "A TP " + this.numTP;
        this.edtId = edtData.resources;
        this.lastUpdate = lastUpdate;
        this.edtIcs = edtIcs;
        this.setJSON();
    }

    getAPIData() {
        return {
            numEta: this.numEta,
            nomEta: this.nomEta,
            numAnnee: this.numAnnee,
            numTP: this.numTP,
            nomEDT: this.nomEDT,
            edtName: this.edtName,
            edtId: this.edtId,
            lastUpdate: this.lastUpdate
        };
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

        try {
            let eventComps = new ICAL.Component(ICAL.parse(this.edtIcs.trim())).getAllSubcomponents("vevent");

            let events = eventComps.map(function (item) {
                if (!hasValue(item) || getValue(item, 'description').split('\n').length < 5) return null;

                let description = getValue(item, 'description').split('\n');
                return {
                    "title": getValue(item, 'summary'),
                    "enseignant": getEnseignant(description),
                    "start": getValue(item, 'dtstart').toJSDate(),
                    "end": getValue(item, 'dtend').toJSDate(),
                    "location": getValue(item, 'location')
                };
            });

            return events.filter(el => el != null);
        } catch (ex) {
            return [];
        }
    }
}

function getEnseignant(description) {
    const length = description.length;
    let firstLoop = true;
    let index = 3;
    let maxLength = 6;

    while (index < length && description[index - 1].startsWith("GRP_")) {
        index += firstLoop ? 1 : 2;
        maxLength += firstLoop ? 1 : 2;

        firstLoop = false;
    }

    if (length != maxLength || index >= length) return '';

    return description[index];
}

function getValue(item, value) {
    return item.getFirstPropertyValue(value);
}

function hasValue(item) {
    return !!getValue(item, 'summary') &&
        !!getValue(item, 'description') &&
        !!getValue(item, 'location') &&
        !!getValue(item, 'dtstart') &&
        !!getValue(item, 'dtend');
}