var edtData;

function initTools(tmpEdtData) {
    edtData = tmpEdtData;
    initClipboard();
    loadEDTName();
}

function loadEDTName() {
    document.title = "EtuEDT - " + edtData.edtName;
    ready('.fc-view-container', calendarView => {
        if (document.querySelector('#calendarView')) return;

        let div = document.createElement('div');
        div.style.textAlign = "center";
        div.id = "calendarView";
        let span = document.createElement('span');
        span.style.fontSize = "24px";
        span.textContent = edtData.edtName;
        div.append(span);
        calendarView.insertAdjacentElement("afterbegin", div);
    });
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

function getDateWFormat(jsDate) {
    let mom = moment(new Date(jsDate));
    let date = mom.format("HH");
    date += mom.format("mm") == "00" ? 'h' : ':' + mom.format("mm");

    return date;
}