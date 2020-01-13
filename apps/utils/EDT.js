const ICAL = require('ical.js');

module.exports = class EDT {
    constructor(edtData, lastUpdate, edtIcs) {
        this.numUniv = edtData.numUniv;
        this.nomUniv = edtData.nomUniv;
        this.numAnnee = edtData.numAnnee;
        this.numTP = edtData.numTP;
        this.nomEDT = edtData.nomEDT;
        this.edtName = this.numAnnee + "A TP " + this.numTP;
        this.edtId = edtData.etupass;
        this.lastUpdate = lastUpdate;
        this.edtIcs = edtIcs;
        this.setJSON();
    }

    getAPIData() {
        return {
            numUniv: this.numUniv,
            nomUniv: this.nomUniv,
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
                if (item.getFirstPropertyValue("class") != "PUBLIC")
                    return null;
                else {
                    if (!hasValue(item) || getValue(item, 'description').split('\n').length < 5) return null;
                    let description = getValue(item, 'description').split('\n');
                    return {
                        "title": getValue(item, 'summary'),
                        "enseignant": description[4].replace('Enseignant : ', ''),
                        "start": getValue(item, 'dtstart').toJSDate(),
                        "end": getValue(item, 'dtend').toJSDate(),
                        "location": description[0].replace('Salle : ', '')
                    };
                }
            });

            return events.filter(el => el != null);
        } catch (ex) {
            return [];
        }
    }
}

function getValue(item, value) {
    return item.getFirstPropertyValue(value);
}

function hasValue(item) {
    return !!getValue(item, 'summary') &&
        !!getValue(item, 'description') &&
        !!getValue(item, 'dtstart') &&
        !!getValue(item, 'dtend');
}