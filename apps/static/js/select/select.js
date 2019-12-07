window.addEventListener("pageshow", (event) => {
    let historyTraversal = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
    if (historyTraversal)
        window.location.reload();
});

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.optionInput').forEach(item => $('#' + item.id).change(updateOptions));
});

var waitRefresh = 0;

function updateOptions() {
    let divs = Array.from($("#optList")[0].children);
    let opts = divs.map(item => {
        return {
            opt: item.id,
            checked: $(`#check-${item.id}`).prop('checked')
        };
    });

    waitRefresh++;

    document.getElementById("optionLoader").style.display = "inline-block";

    fetch("/option/selectOptions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            options: opts
        })
    }).then(() => {
        waitRefresh--;

        if (waitRefresh <= 0)
            document.getElementById("optionLoader").style.display = "none";
    }).catch(() => waitRefresh--);
}