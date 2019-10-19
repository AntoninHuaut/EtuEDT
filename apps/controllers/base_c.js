const edtManage = require('../utils/edtManage');

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
            edtId: item.edtId,
            edtName: item.edtName,
            numUniv: item.numUniv,
            nomUniv: item.nomUniv,
            numAnnee: item.numAnnee
        };
    });

    let edtFinalList = [];

    edtList.forEach(item => {
        let itemUniv = edtFinalList.find(subItem => subItem.numUniv == item.numUniv);
        if (!itemUniv)
            edtFinalList.push({
                numUniv: item.numUniv,
                nomUniv: item.nomUniv,
                data: []
            });
        let indexUniv = itemUniv ? edtFinalList.indexOf(itemUniv) : edtFinalList.length - 1;
        let dataAnnee = edtFinalList[indexUniv].data;

        let itemAnnee = dataAnnee.find(subItem => subItem.numAnnee == item.numAnnee);
        if (!itemAnnee)
            dataAnnee.push({
                numAnnee: item.numAnnee,
                data: []
            });
        let indexAnnee = indexUniv ? dataAnnee.indexOf(indexUniv) : dataAnnee.length - 1;
        dataAnnee[indexAnnee].data.push(item);
    });

    let convOptions = options.map(item => {
        let isCheck = req.session && req.session.options && req.session.options[item];
        return {
            name: item,
            checked: isCheck
        }
    });

    res.render('select', {
        edtList: edtFinalList,
        options: convOptions
    });
}