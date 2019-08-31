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
fetch("/edt/edtData").then(res => res.json()).then(result => {
    res = result;
    loadEDT(0);
});

async function loadEDT(countTry, data) {
    if (res.edtID == null) return window.location = '/';

    if (countTry == 0) return $.get('/data/' + res.edtID + "/").then(data => loadEDT(countTry + 1, data));

    if (countTry > 0)
        document.getElementById('loadInfos').innerHTML = countTry > 5 ? "Chargement impossible..." : "Essai numéro " + countTry;

    if (countTry > 5)
        return setTimeout(() => {
            window.location.assign(window.location.origin + "/");
        }, 3000);

    if (!data || !!data.error || !data.edtData || data.edtData.includes('HTTP ERROR'))
        setTimeout(() => loadEDT(countTry + 1), 500);
    else {
        document.title = "EtuEDT - " + data.edtName;
        document.getElementById('update').innerHTML = 'Dernière update le ' + moment(data.lastUpdate).format('DD/MM/YYYY à HH[h]mm');
        document.getElementById('edtName').innerHTML = 'EDT : ' + data.edtName;
        let eventComps = new ICAL.Component(ICAL.parse(data.edtData.trim())).getAllSubcomponents("vevent");

        let events = eventComps.map(function (item) {
            if (item.getFirstPropertyValue("class") != "PUBLIC")
                return null;
            else {
                if (!hasValue(item) || getValue(item, 'description').split('\n').length < 5) return null;

                let data = {
                    "title": getValue(item, 'summary'),
                    "enseignant": getValue(item, 'description').split('\n')[4].replace('Enseignant : ', ''),
                    "start": getValue(item, 'dtstart').toJSDate(),
                    "end": getValue(item, 'dtend').toJSDate(),
                    "location": getValue(item, '"location')
                };

                data.color = getColorMatiere(data.title);

                if (data.title.toLowerCase().includes('soutien') && !res.options.soutien) {
                    data.start = 0;
                    data.end = 0;
                }

                return data;
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