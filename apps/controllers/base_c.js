const edtManage = require('../utils/edtManage');

const options = ["soutien", "enseignant"];

exports.getOptions = () => {
    return options;
}

exports.select = async function (req, res) {
    let edtList = edtManage.getEDTInfos();
    if (!edtManage.isInit()) return res.render('select', {
        edtID: req.session.edtID,
        init: true
    });

    edtList = edtList.map(item => {
        return {
            edtId: item.edtId,
            edtName: item.edtName,
            numEta: item.numEta,
            nomEta: item.nomEta,
            numAnnee: item.numAnnee
        };
    });

    let edtFinalList = [];

    edtList.forEach(item => {
        let itemEta = edtFinalList.find(subItem => subItem.numEta == item.numEta);
        if (!itemEta)
            edtFinalList.push({
                numEta: item.numEta,
                nomEta: item.nomEta,
                data: []
            });
        let indexEta = itemEta ? edtFinalList.indexOf(itemEta) : edtFinalList.length - 1;
        let dataAnnee = edtFinalList[indexEta].data;

        let itemAnnee = dataAnnee.find(subItem => subItem.numAnnee == item.numAnnee);
        if (!itemAnnee)
            dataAnnee.push({
                numAnnee: item.numAnnee,
                data: []
            });
        let indexAnnee = itemAnnee ? dataAnnee.indexOf(itemAnnee) : dataAnnee.length - 1;
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
        edtID: req.session.edtID,
        edtList: edtFinalList,
        options: convOptions,
        darkTheme: req.session.darkTheme
    });
}