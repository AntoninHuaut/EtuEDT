const EDTCache = require('./edtCache');
const ICAL = require('ical.js');
const cache = new EDTCache();

exports.isInit = () => {
    return cache.isInit();
}

exports.getAll = () => {
    return cache.getAll();
}

exports.getEDTName = () => {
    return cache.getEDTName();
}

exports.getEDTInfos = () => {
    return cache.getEDTInfos();
}

exports.toJson = (edtItem) => {
    if (!edtItem.edtData || edtItem.edtData.includes('HTTP ERROR')) return {
        "error": edtItem.edtId + " not available"
    };

    let eventComps = new ICAL.Component(ICAL.parse(edtItem.edtData.trim())).getAllSubcomponents("vevent");

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