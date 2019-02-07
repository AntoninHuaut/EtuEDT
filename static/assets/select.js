var color = ["red", "orange", "amber", "khaki", "lime", "light-green", "green"];
var defaultEdtCookie = JSON.parse('{"edtID": 0, "soutien": true}');

$('document').ready(function () {
    let btnList = $('#btnList');

    $.get("../data", function (data) {
        for (let i = 0; i < data.count; i++)
            btnList.append("<div class='alphabetCheck'><btn onclick='redirectEDT(" + i + ")' class='w3-btn w3-" + getColor(i) + "'>" + data[i].edtName + "</btn></div>");
    });

    let edtCookieC = getCookie('edtCookie');
    let soutien = defaultEdtCookie.soutien ? 0 : 1;
    if (cookieIsValid(edtCookieC))
        soutien = parseObjectFromCookie(edtCookieC).soutien ? 0 : 1;
    else
        createCookie("edtCookie", defaultEdtCookie);

    $('.radioSoutien')[soutien].checked = true;
});

function updateType(value) {
    let edtCookieC = getCookie('edtCookie');
    let cookieValue;

    if (!cookieIsValid(edtCookieC))
        cookieValue = defaultEdtCookie;
    else
        cookieValue = parseObjectFromCookie(edtCookieC);

    cookieValue.soutien = value == 0;
    createCookie("edtCookie", cookieValue);
}

function getColor(i) {
    while (i >= color.length)
        i -= color.length;

    return color[i];
}

function redirectEDT(edtID) {
    let edtCookieC = getCookie('edtCookie');
    let edtCookie = defaultEdtCookie;
    if (edtCookieC)
        edtCookie = parseObjectFromCookie(edtCookieC);

    edtCookie.edtID = edtID;
    createCookie("edtCookie", edtCookie);
    window.location.assign(window.location.origin + "/edt");
}