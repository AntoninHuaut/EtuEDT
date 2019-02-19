const async = require('async');
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const request = require("request");
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var cache = '{"error": "Initialization has not yet been performed"}';

app.use('/data/:edtID?/:dataOnly?', function (req, res, next) {
	let edtID = req.params.edtID;
	let dataOnly = req.params.dataOnly;
	let edtIDType = isNaN(edtID) ? 'edtName' : 'edtID';
	dataOnly = !dataOnly ? false : dataOnly.toLowerCase() == 'raw';

	if (!edtID) {
		let tmpCache = JSON.parse(JSON.stringify(cache));
		for (let i = 0; i < tmpCache.count; i++) {
			delete tmpCache[i].lastUpdate;
			delete tmpCache[i].edtData;
		}
		res.send(tmpCache);
		return;
	} else if (edtIDType == 'edtName') {
		if (edtID != "count")
			for (let i = 0; i < cache.count; i++)
				if (cache[i].edtName.replace(/ /g, '_') == edtID) {
					edtID = i;
					break;
				}

		if(isNaN(edtID))
			edtID = -1;
	} else if (edtIDType == 'edtID' && !cache[edtID])
		edtID = -1;

	if (edtID != -1)
		res.send(dataOnly ? cache[edtID].edtData : cache[edtID]);
	else
		res.send('{"error": "' + edtIDType + ' does not exist"}');
});

app.use("/edt/:edtID", function (req, res, next) {
	let edtID = req.params.edtID;
	if (!edtID || !cache[edtID] || edtID == "count" || !req.cookies.edtCookie)
		res.redirect('/');
	else {
		let cookieValue = JSON.parse(req.cookies.edtCookie);
		cookieValue['edtID'] = edtID;
		res.cookie('edtCookie', JSON.stringify(cookieValue));
		res.redirect('/edt');
	}
});

app.use("/edt", function (req, res, next) {
	res.sendFile(__dirname + '/static/edt.html');
});

app.use("/", function (req, res, next) {
	res.sendFile(__dirname + '/static/select.html');
});

reloadEDT();
setInterval(reloadEDT, 15 * 60 * 1000);

app.listen(config.port);

function reloadEDT() {
	let tmpCache = {
		count: 0
	};

	let date = new Date();

	async.map(config.edt, httpGet, function (err, res) {
		if (err) return console.log(err);

		for (let i = 0; i < res.length; i++) {
			tmpCache.count += 1;

			if (res[i].includes('HTTP ERROR') && !!cache[i] && cache[i].hasOwnProperty("edtData"))
				tmpCache[i] = cache[i];
			else
				tmpCache[i] = {
					'edtName': config.edt[i].name,
					'lastUpdate': date,
					'edtData': res[i]
				};
		}

		cache = tmpCache;
	});
}

function httpGet(confEl, callback) {
	const options = {
		method: 'GET',
		url: 'https://webmail.unicaen.fr/home/' + confEl.account + '/Emploi%20du%20temps',
		headers: {
			"Authorization": confEl.basicToken
		},
		qs: {
			auth: 'ba',
			fmt: 'ics'
		}
	};
	request(options,
		function (err, res, body) {
			callback(err, convertString(body));
		}
	);
}

var regexCString = new RegExp('\\?\\?', 'g');

function convertString(str) {
	if (!str)
		return str;

	str = str.replace(/Amphith\?\?\?\?tre/g, 'Amphi');
	let splited = str.split('\r');

	for (let i = 0; i < splited.length; i++)
		if (splited[i].startsWith('\nSUMMARY:') && splited[i].toLowerCase().includes('_s'))
			splited[i] = splited[i].substring(0, splited[i].toLowerCase().indexOf('_s'));

	str = splited.join('');

	return str.replace(regexCString, 'e');
}