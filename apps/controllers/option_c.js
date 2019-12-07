exports.selectOptions = async function (req, res) {
    if (!req.body.options || !Array.isArray(req.body.options))
        return res.status(400).send({
            error: "parameters errors"
        });

    req.body.options.forEach(item => req.session.options[item.opt] = item.checked);
    res.status(200).send({
        success: "200"
    });
}