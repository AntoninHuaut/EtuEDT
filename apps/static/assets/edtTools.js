var edtTool = document.getElementById('edtName');

function initTools(edtData) {
    let edtName = edtData.edtName.replace(/ /g, '_');
    initIMGEDT(edtName, edtData.lastUpdate);
    initClipboard(window.origin + "/data/" + edtName + "/raw");
}

function initIMGEDT(edtName, lastUpdate) {
    edtTool.innerHTML += ' <i id="edtExportImg" title="Exporter l\'emploi du temps" class="edtToolbar fas fa-image"></i> ';
    lastUpdate = moment(lastUpdate).format("[_]DD[-]MM[-]YYYY[_]HH[:]mm");

    setTimeout(() => {
        document.getElementById('edtExportImg').onclick = () => {
            html2canvas(document.querySelector(".fc-view-container")).then(canvas => {
                downloadURI(canvas.toDataURL(), edtName + lastUpdate + ".png");
            });
        }
    }, 10);
}

function initClipboard(edtRawUrl) {
    edtTool.innerHTML = '<i data-clipboard-text="' + edtRawUrl + '" title="Obtenir le lien brut de l\'emploi du temps" class="edtToolbar clipboard fas fa-unlink"></i> ' + edtTool.innerHTML;
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

function downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}