function redirectEDT(edtID) {
    let divs = Array.from($("#optList")[0].children);
    let opts = divs.map(item => {
        return {
            opt: item.id,
            checked: $(`#check-${item.id}`).prop('checked')
        };
    });

    fetch("/edt/selectEDT", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            edtID: edtID,
            options: opts
        })
    }).then(res => res.json()).then(res => {
        if (res.error)
            window.location.reload();
        else
            window.location = '/edt';
    });
}