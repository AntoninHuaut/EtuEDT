function loadCalendar(listEvents, edtCookie) {
    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
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
                    let enseignant = !edtCookie.enseignant ? " " : event.enseignant;

                    el.childNodes[0].childNodes[0].innerHTML += ("<div style='font-size: 85%; font-style: italic; float: right;'> " + enseignant + "</div>");
                    el.childNodes[0].childNodes[1].innerHTML += ("<div style='font-size: 85%; font-weight: normal; float: right;'>" + location + "</div>");
                }
            } else if (event.view.type == "dayGridMonth") {
                el = el.childNodes[0];
                let size = el.childNodes.length;

                if (size > 2) {
                    el.querySelector('span').style.fontWeight = 'normal';
                    el.querySelector('span').style.fontSize = '90%';
                } else
                    // Fix Fullcalendar bug
                    el.innerHTML = "<span class='fc-time' style='font-weight: normal; font-size: 90%'>" + getDateWFormat(event.event.start) + "</span>" + el.innerHTML;

                el.querySelectorAll('span')[1].style.fontWeight = '450';
                el.querySelectorAll('span')[1].style.fontSize = '95%';

                let props = event.event.extendedProps;
                if (props.location != null && props.location != "")
                    el.innerHTML += "<div style='font-weight: normal; font-size: 80%; float: right;'>" + props.location + "</div>";
            }
        },
        viewSkeletonRender: () => {
            document.querySelectorAll('.fc-divider').forEach(get => get.parentElement.removeChild(get));
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
}

function getDateWFormat(jsDate) {
    let mom = moment(new Date(jsDate));
    let date = mom.format("HH");
    date += mom.format("mm") == "00" ? ' h' : ':' + mom.format("mm");

    return date;
}