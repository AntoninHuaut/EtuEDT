var color = ["red", "orange", "amber", "khaki", "lime", "light-green", "green"];

$('document').ready(function () {
    let btnList = $('#btnList');

    $.get("../data", function (data) {
        for (let i = 0; i < data.count; i++)
            btnList.append("<div class='alphabetCheck'><btn onclick='redirectEDT(" + i + ")' class='w3-btn w3-" + getColor(i) + "'>" + data[i].edtName + "</btn></div>");
    });
});

function getColor(i) {
    while (i >= color.length)
        i -= color.length;

    return color[i];
}

function redirectEDT(edtID) {
    createCookie("edtCookie", JSON.parse('{"edtID": ' + edtID + '}'));
    window.location.assign(window.location.origin + "/edt");
}