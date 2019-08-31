var matExcluList = ['TD', 'TP', 'CM', 'CC', 'CTP'];
var colors = {
    increment: 0
};
var colorsList = randomColor({
    count: 100,
    seed: 96369169,
    format: 'rgba',
    alpha: 0.7
});

var res;
initEDT();

function initEDT() {
    let rawLinkICS = $("#rawLinkICS");
    rawLinkICS.attr("data-clipboard-text", window.location.origin + rawLinkICS.attr("data-clipboard-text"));

    fetch("/edt/edtData").then(res => res.json()).then(result => {
        res = result;
        loadEDT(0);
    });
}

function loadEDT(countTry, data) {
    if (res.edtID == null) return window.location = '/';

    if (countTry == 0) return fetch(`/data/${res.edtID}`).then(res => res.json()).then(data => loadEDT(countTry + 1, data));

    if (countTry > 0)
        document.getElementById('loadInfos').innerHTML = countTry > 5 ? "Chargement impossible..." : "Essai numéro " + countTry;

    if (countTry > 5)
        return setTimeout(() => {
            window.location.assign(window.location.origin + "/");
        }, 3000);

    if (!data || !!data.error || !data.edtData || data.edtData.includes('HTTP ERROR'))
        setTimeout(() => loadEDT(countTry + 1), 500);
    else {
        let eventComps = new ICAL.Component(ICAL.parse(data.edtData.trim())).getAllSubcomponents("vevent");

        let events = eventComps.map(function (item) {
            if (item.getFirstPropertyValue("class") != "PUBLIC")
                return null;
            else {
                if (!hasValue(item) || getValue(item, 'description').split('\n').length < 5) return null;

                let dataEvent = {
                    "title": getValue(item, 'summary'),
                    "enseignant": getValue(item, 'description').split('\n')[4].replace('Enseignant : ', ''),
                    "start": getValue(item, 'dtstart').toJSDate(),
                    "end": getValue(item, 'dtend').toJSDate(),
                    "location": getValue(item, '"location')
                };

                dataEvent.color = getColorMatiere(dataEvent.title);

                if (dataEvent.title.toLowerCase().includes('soutien') && !res.options.soutien) {
                    dataEvent.start = 0;
                    dataEvent.end = 0;
                }

                return dataEvent;
            }
        });

        events = events.filter(el => el != null);

        loadCalendar(events, res.options);
        initTools(data);
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

function getColorMatiere(mat) {
    mat = mat.replace(/ /g, '');
    matExcluList.forEach(get => mat = mat.replace(get, ''));

    if (!colors[mat]) {
        if (colors.increment >= colorsList.length)
            colors.increment = 0;

        colors[mat] = colorsList[colors.increment++];
    }

    return colors[mat];
}

function getRandomColor() {
    return Math.floor(Math.random() * colorsList.length);
}