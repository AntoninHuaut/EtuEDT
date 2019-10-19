function initTools(edtData) {
    initClipboard();
}

function initClipboard() {
    let clipboard = new ClipboardJS('.clipboard');

    clipboard.on('success', function (e) {
        if (e.action == 'copy')
            iziToast.show({
                title: "Le lien brut de l'emploi du temps a été copié",
                color: 'green',
                position: 'topLeft',
                timeout: 2500,
            });
    });
}

function defaultView() {
    if (jQuery.browser.mobile)
        calendar.changeView("timeGridDay");
}

function keyUpdateCalendar(e) {
    e = e || window.event;
    let key = e.keyCode;
    let index = views.indexOf(calendar.view.type);

    if (key == '40') {
        index--;
        index = index < 0 ? views.length - 1 : index;
    } else if (key == '38') {
        index++;
        index = index >= views.length ? 0 : index;
    } else if (key == '37')
        calendar.prev();
    else if (key == '39')
        calendar.next();
    else if (key == '17')
        calendar.today();
    else
        return true;

    if (key == '40' || key == '38')
        calendar.changeView(views[index]);

    return false;
}

function getDateWFormat(jsDate) {
    let mom = moment(new Date(jsDate));
    let date = mom.format("HH");
    date += mom.format("mm") == "00" ? ' h' : ':' + mom.format("mm");

    return date;
}