const matExcluList = ['TD', 'TP', 'CM', 'CC', 'CTP'];
const colors = {
    increment: 0
};
const colorsList = randomColor({
    count: 100,
    seed: 96369169,
    format: 'rgba',
    alpha: 0.7
});
const regexNumber = /(\d+)/g;

var res;
initEDT();

function initEDT() {
    let rawLinkICS = $("#rawLinkICS");
    rawLinkICS.attr("data-clipboard-text", window.location.origin.replace("https", "http") + rawLinkICS.attr("data-clipboard-text"));

    const resRegex = window.location.pathname.match(regexNumber);
    const extra = resRegex ? "/" + resRegex[0] : "";

    fetch(`/edt/edtData${extra}`).then(res => res.json()).then(result => {
        res = result;
        loadEDT(0);
    });
}

function loadEDT(countTry, data) {
    if (res.edtID == null) return window.location = '/';

    if (countTry == 0)
        return Promise.all([fetch(`/data/${res.edtID}`).then(res => res.json()), fetch(`/data/${res.edtID}/json`).then(res => res.json())])
            .then(data => loadEDT(countTry + 1, data));

    if (countTry > 0)
        document.getElementById('loadInfos').innerHTML = countTry > 5 ? "Chargement impossible..." : "Essai numéro " + countTry;

    if (countTry > 5)
        return setTimeout(() => {
            window.location.assign(window.location.origin + "/");
        }, 3000);

    if (!data || data.length != 2 || !data[0] || !!data[0].error || !data[1] || !!data[1].error)
        setTimeout(() => loadEDT(countTry + 1), 500);
    else {
        let events = data[1];
        events = events.map((item) => {
            item.color = getColorMatiere(item.title);
            if (item.title.toLowerCase().includes('soutien') && !res.options.soutien) {
                item.start = 0;
                item.end = 0;
            }
            return item;
        });

        initTools(data[0]);
        loadCalendar(events, res.options);
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