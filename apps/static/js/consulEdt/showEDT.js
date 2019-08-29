var calendar;
var views = ['timeGridDay', 'timeGridWeek', 'dayGridMonth'];

function loadCalendar(listEvents, options) {
    let calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'timeGrid', 'bootstrap'],
        themeSystem: 'bootstrap',
        events: listEvents,
        locale: 'fr',
        weekends: false,
        header: {
            left: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth, prev,next, today'
        },
        titleFormat: {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        },
        defaultView: 'timeGridWeek',
        firstDay: 1,
        height: "auto",
        contentHeight: "auto",

        // TimeGrid
        allDaySlot: false,
        allDayText: false,
        minTime: "07:00:00",
        maxTime: "19:00:00",
        nowIndicator: true,
        //
        // Methods
        eventRender: function (event) {
            let el = event.el;
            el.style.color = 'black';
            el.style.fontWeight = 600;

            if (event.view.type == "timeGridWeek" || event.view.type == "timeGridDay") {
                el.childNodes[0].childNodes[0].style.fontWeight = 'bold';
                el.childNodes[0].childNodes[0].style.fontSize = '90%';
                el.childNodes[0].childNodes[0].style.fontStyle = 'italic';

                let title = event.event.title;
                event = event.event.extendedProps;
                if (event.location != null && event.location != "") {
                    el.childNodes[0].childNodes[0].childNodes[0].style.display = "inline-block";

                    let location = event.location == "Amphi" && title.startsWith("CM ") ? " " : event.location;
                    let enseignant = !options.enseignant ? " " : event.enseignant;

                    el.childNodes[0].childNodes[0].innerHTML += ("<div style='font-size: 85%; font-style: italic; float: right;'> " + enseignant + "</div>");
                    el.childNodes[0].childNodes[1].innerHTML += ("<div style='font-size: 85%; font-weight: normal; float: right;'>" + location + "</div>");
                }
            } else if (event.view.type == "dayGridMonth") {
                el = el.childNodes[0];
                let spans = el.querySelectorAll('span');
                spans[0].style.fontWeight = 'normal';
                spans[0].style.fontSize = '90%';
                spans[1].style.fontWeight = '450';
                spans[1].style.fontSize = '95%';

                let props = event.event.extendedProps;
                if (props.location != null && props.location != "")
                    el.innerHTML += "<div style='font-weight: normal; font-size: 80%; float: right;'>" + props.location + "</div>";
            }
        },
        eventClick: function (info) {
            info = info.event;
            let msg = "<table class='popup'>" +
                "<tr><td>Enseignant: </td> <td class='popup_marge'> " + info.extendedProps.enseignant + "</td></tr>" +
                "<tr><td>Horaire: </td> <td class='popup_marge'> " + getDateWFormat(info.start) + " - " + getDateWFormat(info.end) + "</td></tr>" +
                "<tr><td>Location: </td> <td class='popup_marge'> " + info.extendedProps.location + "</td></tr>" +
                "</table>";

            iziToast.show({
                title: info.title,
                message: msg,
                layout: 2,
                maxWidth: '500',
                position: 'topCenter',
                timeout: false,
                titleLineHeight: '50',
                messageLineHeight: '30',
                titleSize: '24',
                messageSize: '20',
                displayMode: 1,
                overlay: true,
                overlayClose: true
            });

        },
        eventMouseEnter: function (info) {
            info.el.style.cursor = 'pointer';
        },
        eventMouseLeave: function (info) {
            info.el.style.cursor = 'auto';
        }
    });

    document.getElementById("load").style.display = "none";
    calendar.render();

    let date = moment(new Date());
    while (date.isoWeekday() >= 6 && date > calendar.getDate())
        calendar.next();

    document.onkeydown = keyUpdateCalendar;
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