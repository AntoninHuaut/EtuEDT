module.exports = async function (req, res) {
    req.session.darkTheme = !req.session.darkTheme;
    res.redirect('/');
}