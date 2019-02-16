function loadCalendar(listEvents) {
    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'timeGrid', 'bootstrap'],
        themeSystem: 'bootstrap',
        events: listEvents,
        locale: 'fr',
        weekends: false,
        header: {
            left: 'title',
            right: 'timeGridWeek,dayGridMonth, prev,next, today'
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

            if (event.view.type == "timeGridWeek") {
                el.childNodes[0].childNodes[0].style.fontWeight = 'bold';
                el.childNodes[0].childNodes[0].style.fontSize = '90%';
                el.childNodes[0].childNodes[0].style.fontStyle = 'italic';

                event = event.event.extendedProps;
                if (event.location != null && event.location != "") {
                    el.childNodes[0].childNodes[0].childNodes[0].style.display = "inline-block";
                    el.childNodes[0].childNodes[0].innerHTML += ("<div style='font-size: 85%; font-style: italic; float: right;'> " + event.enseignant + "</div>");
                    el.childNodes[0].childNodes[1].innerHTML += ("<div style='font-size: 85%; font-weight: normal; float: right;'>" + event.location + "</div>");
                }
            } else if (event.view.type == "dayGridMonth") {
                el = el.childNodes[0];
                let size = el.childNodes.length;

                if (size > 2) {
                    el.querySelector('span').style.fontWeight = 'normal';
                    el.querySelector('span').style.fontSize = '90%';
                } else {
                    // Fix Fullcalendar bug
                    let mom = moment(new Date(event.event.start));
                    let date = mom.format("HH");
                    date += mom.format("mm") == "00" ? ' h' : ':' + mom.format("mm");

                    el.innerHTML = "<span class='fc-time' style='font-weight: normal; font-size: 90%'>" + date + "</span>" + el.innerHTML;
                }

                el.querySelectorAll('span')[1].style.fontWeight = '450';
                el.querySelectorAll('span')[1].style.fontSize = '95%';

                let props = event.event.extendedProps;
                if (props.location != null && props.location != "")
                    el.innerHTML += "<div style='font-weight: normal; font-size: 80%; float: right;'>" + props.location + "</div>";
            }
        },
        viewSkeletonRender: () => {
            document.querySelectorAll('.fc-divider').forEach(get => get.parentElement.removeChild(get));
        }
    });

    document.getElementById("load").style.display = "none";
    calendar.render();

    let date = moment(new Date());
    while (date.isoWeekday() >= 6 && date > calendar.getDate())
        calendar.next();
}