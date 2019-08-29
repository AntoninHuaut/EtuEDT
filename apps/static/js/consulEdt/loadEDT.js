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

async function loadEDT(countTry, data) {
    let res = await (fetch("/edt/edtData").then(res => res.json()));
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
        document.title = "EDT : " + data.edtName + " Informatique";
        document.getElementById('update').innerHTML = 'Dernière update le ' + moment(data.lastUpdate).format('DD/MM/YYYY à HH[h]mm');
        document.getElementById('edtName').innerHTML = 'EDT : ' + data.edtName;
        let eventComps = new ICAL.Component(ICAL.parse(data.edtData.trim())).getAllSubcomponents("vevent");

        let events = eventComps.map(function (item) {
            if (item.getFirstPropertyValue("class") != "PUBLIC") {
                return null;
            } else {
                let data = {
                    "title": item.getFirstPropertyValue("summary"),
                    "enseignant": item.getFirstPropertyValue('description').split('\n')[4].replace('Enseignant : ', ''),
                    "start": item.getFirstPropertyValue("dtstart").toJSDate(),
                    "end": item.getFirstPropertyValue("dtend").toJSDate(),
                    "location": item.getFirstPropertyValue("location")
                };

                data.color = getColorMatiere(data.title);

                if (data.title.toLowerCase().includes('soutien') && !res.options.soutien) {
                    data.start = 0;
                    data.end = 0;
                }

                return data;
            }
        });

        loadCalendar(events, res.options);
        initTools(data);
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

function getRandomColor() {
    return Math.floor(Math.random() * colorsList.length);
}