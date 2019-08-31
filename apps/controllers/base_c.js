const edtManage = require('../utils/edtManage');

const colors = ["primary", "success", "danger", "warning", "info", "dark"];
const options = ["soutien", "enseignant"];

exports.getOptions = () => {
    return options;
}

exports.select = async function (req, res) {
    let edtList = edtManage.getEDTInfos();
    if (!edtManage.isInit()) return res.render('select', {
        init: true
    });

    edtList = edtList.map(item => {
        return {
            "edtID": item.edtId,
            "edtName": item.edtName,
            "color": getColor(edtList.indexOf(item))
        };
    });

    let convOptions = options.map(item => {
        let isCheck = req.session && req.session.options && req.session.options[item];
        return {
            name: item,
            checked: isCheck
        }
    });

    res.render('select', {
        edtList: edtList,
        options: convOptions
    });
}

function getColor(i) {
    return colors[i % colors.length];
}