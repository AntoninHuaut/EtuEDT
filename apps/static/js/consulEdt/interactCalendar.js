document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) return;
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    xDown = null;
    yDown = null;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) interactRight();
        else interactLeft();
    }
    /*else {
           if (yDiff > 0) interactDown();
           else interactUp();
       }*/
};

function keyUpdateCalendar(e) {
    let key = (e || window.event).keyCode;
    if (key == '40') interactDown();
    else if (key == '38') interactUp();
    else if (key == '37') interactLeft();
    else if (key == '39') interactRight();
    else if (key == '17') calendar.today();
}

function interactLeft() {
    calendar.prev();
}

function interactRight() {
    calendar.next();
}

function interactUp() {
    let index = views.indexOf(calendar.view.type);
    index++;
    index = index >= views.length ? 0 : index;
    calendar.changeView(views[index]);
}

function interactDown() {
    let index = views.indexOf(calendar.view.type);
    index--;
    index = index < 0 ? views.length - 1 : index;
    calendar.changeView(views[index]);
}

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}