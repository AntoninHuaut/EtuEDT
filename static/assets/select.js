var color = ["red", "orange", "amber", "lime", "light-green", "green"];
var defaultEdtCookie = JSON.parse('{"edtID": 0, "soutien": true, "enseignant": true}');
var options = ["soutien", "enseignant"];

var optTemplate = '<div id="{NAME}">' +
    '<span class="infos">Afficher les {NAME}s :</span>' +
    '<div class="switch">' +
    '<label>' +
    '<input id="{NAME}switch" onclick="updateType({NAME})" type="checkbox">' +
    '<span class="lever"></span>' +
    '</label>' +
    '</div>' +
    '</div>';

$('document').ready(() => {
    let edtCookieC = getCookie('edtCookie');
    let cooVars = {
        "soutien": defaultEdtCookie.soutien,
        "enseignant": defaultEdtCookie.enseignant
    };

    if (cookieIsValid(edtCookieC)) {
        cooVars.soutien = parseObjectFromCookie(edtCookieC).soutien;
        cooVars.enseignant = parseObjectFromCookie(edtCookieC).enseignant;
    } else
        createCookie("edtCookie", defaultEdtCookie);

    for (let i = 0; i < options.length; i++) {
        let name = options[i];
        $('#main')[0].innerHTML += optTemplate.replace(/{NAME}/g, name);

        setTimeout(() => {
            $('#' + name + 'switch')[0].checked = cooVars[name];
        }, 1);
    }

    let btnList = $('#btnList');

    $.get("../data", function (data) {
        for (let i = 0; i < data.count; i++) {
            btnList.append("<div class='alphabetCheck'><btn onclick='redirectEDT(" + i + ")' class='" +
                "waves-effect waves-light btn-large " + getColor(i) + " lighten-1" +
                "'>" + data[i].edtName + "</btn></div>");
        }
    });
});

function updateType(value) {
    let id = options.indexOf(value.id);
    let isCheck = value.querySelector('input').checked;

    let edtCookieC = getCookie('edtCookie');
    let cookieValue;

    if (!cookieIsValid(edtCookieC))
        cookieValue = defaultEdtCookie;
    else
        cookieValue = parseObjectFromCookie(edtCookieC);

    if (id == 0)
        cookieValue.soutien = isCheck;
    else if (id == 1)
        cookieValue.enseignant = isCheck;

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