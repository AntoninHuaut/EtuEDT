var matExcluList = ['TD', 'TP', 'CM', 'CC', 'CTP'];
var colors = {
    increment: 0
};
var colorsList = randomColor({
    count: 100,
    seed: 96369169,
    format: 'rgba',
    alpha: 0.6
});

loadEDT(0);

function loadEDT(countTry, data) {
    if (countTry > 1)
        $('#loadInfos')[0].innerHTML = "Essaie numéro " + countTry;

    if (countTry >= 5) {
        $('#loadInfos')[0].innerHTML = "Impossible de récupérer l'emploi du temps";
        setTimeout(() => {
            window.location.assign(window.location.origin + "/");
        }, 3000);
    } else if (!data) {
        let edtCookieC = getCookie('edtCookie');

        if (!edtCookieC)
            window.location.assign(window.location.origin + "/");
        else
            $.get("../data/" + parseObjectFromCookie(edtCookieC).edtID).then(data => loadEDT(++countTry, data));
    } else if (!!data.error || !data.edtData || data.edtData.includes('HTTP ERROR'))
        setTimeout(() => loadEDT(countTry), 500);
    else {
        document.title = "EDT : " + data.edtName + " Informatique";
        $('#update')[0].innerHTML = 'Dernière update le ' + moment(data.lastUpdate).format('DD/MM/YYYY à HH[h]mm');
        $('#edtName')[0].innerHTML = 'EDT : ' + data.edtName;

        let events = $.map(new ICAL.Component(ICAL.parse(data.edtData.trim())).getAllSubcomponents("vevent"), function (item) {
            if (item.getFirstPropertyValue("class") == "PRIVATE") {
                return null;
            } else {
                let title = convertString(item.getFirstPropertyValue("summary"));
                return {
                    "title": title,
                    "start": item.getFirstPropertyValue("dtstart").toJSDate(),
                    "end": item.getFirstPropertyValue("dtend").toJSDate(),
                    "location": convertString(item.getFirstPropertyValue("location")),
                    "color": getColorMatiere(title)
                };
            }
        });

        loadCalendar(events);
    }
}

function loadCalendar(events) {
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
        locale: "fr",
        weekends: false,
        events: events,
        timeFormat: "HH:mm",
        titleFormat: "DD MMMM YYYY",
        defaultView: 'agendaWeek',
        defaultDate: getDefaultDate(),
        navLinks: true,
        eventLimit: true,
        displayEventEnd: true,
        handleWindowResize: true,
        aspectRatio: 1.05,
        allDaySlot: false,
        themeSystem: "bootstrap4",
        showNonCurrentDates: false,
        minTime: "07:00:00",
        maxTime: "19:00:00",
        eventRender: function (event, element) {
            element[0].childNodes[0].setAttribute("style", "color:black; font-weight: 600;");
            element[0].childNodes[0].childNodes[0].setAttribute("style", "font-weight: normal; font-size: 90%; font-style: italic;");

            if (event.location != null && event.location != "")
                element[0].childNodes[0].innerHTML += ("<div style='font-weight: normal; font-size: 85%; float: right;'>" + event.location + "</div>");
        },
        viewRender: function (view, element) {
            document.querySelectorAll('.fc-divider').forEach(get => get.parentElement.removeChild(get));
        },
        header: {
            left: 'title',
            center: '',
            right: 'agendaWeek,month, prev,next, today'
        }
    });

    document.getElementById("load").setAttribute("style", "display: none");
}

function getDefaultDate() {
    let date = moment(new Date());

    if (date.isoWeekday() >= 6)
        date = date.add(8 - date.isoWeekday(), 'days');

    return date;
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