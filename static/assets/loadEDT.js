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

loadEDT(0);

function loadEDT(countTry, data) {
    let edtCookieC = getCookie('edtCookie');
    if (!cookieIsValid(edtCookieC)) {
        window.location.assign(window.location.origin + "/");
        return;
    }

    let edtCookie = parseObjectFromCookie(edtCookieC);

    if (countTry > 1)
        document.getElementById('loadInfos').innerHTML = "Essai numéro " + countTry;

    if (countTry > 5) {
        document.getElementById('loadInfos').innerHTML = "Chargement impossible...";
        setTimeout(() => {
            window.location.assign(window.location.origin + "/");
        }, 3000);
    } else if (!data)
        $.get('/data/' + edtCookie.edtID + "/").then(data => loadEDT(++countTry, data));
    else if (!!data.error || !data.edtData || data.edtData.includes('HTTP ERROR'))
        setTimeout(() => loadEDT(countTry), 500);
    else {
        document.title = "EDT : " + data.edtName + " Informatique";
        document.getElementById('update').innerHTML = 'Dernière update le ' + moment(data.lastUpdate).format('DD/MM/YYYY à HH[h]mm');
        document.getElementById('edtName').innerHTML = 'EDT : ' + data.edtName;

        let eventComps = new ICAL.Component(ICAL.parse(data.edtData.trim())).getAllSubcomponents("vevent");

        let events = eventComps.map(function (item) {
            if (item.getFirstPropertyValue("class") != "PUBLIC") {
                return null;
            } else {
                let data = {
                    "title": convertString(item.getFirstPropertyValue("summary")),
                    "enseignant": convertString(item.getFirstPropertyValue('description').split('\n')[4].replace('Enseignant : ', '')),
                    "start": item.getFirstPropertyValue("dtstart").toJSDate(),
                    "end": item.getFirstPropertyValue("dtend").toJSDate(),
                    "location": convertString(item.getFirstPropertyValue("location"))
                };

                data.color = getColorMatiere(data.title);

                if (data.title.toLowerCase().includes('soutien') && !edtCookie.soutien) {
                    data.start = 0;
                    data.end = 0;
                }

                return data;
            }
        });

        loadCalendar(events, edtCookie);
    }
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

var regexCString = new RegExp('\\?\\?', 'g');

function convertString(str) {
    if (!str)
        return str;

    if (str.startsWith('Amphi'))
        return 'Amphi';

    let get = str.match(/.+?(?=_)/);
    if (!!get)
        str = get[0];

    return str.replace(regexCString, 'e');
}

function getRandomColor() {
    return Math.floor(Math.random() * colorsList.length);
}