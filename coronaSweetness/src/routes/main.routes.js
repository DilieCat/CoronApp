const express = require('express');
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const router = express.Router();
let mainUserId = '';

let accounts = [
	{
		userId: 1,
		username: 'A',
		password: 'test',
		userlevel: 1,
		ggdAuthCode: 'Yeet',
	},
	{ userId: 2, username: 'B', password: 'test', userlevel: 1 },
	{ userId: 3, username: 'GGD', password: 'test', userlevel: 2 },
];

let contacts = [
	{ userId: 1, meeted: [2] },
	{ userId: 2, meeted: [] },
];
let alerts = [1];

//Check if user is authenticated
router.all('*', function (req, res, next) {
	assert(
		typeof req.headers['x-access-token'] == 'string',
		'token is not a string!'
	);

	token = req.header('X-Access-Token') || '';
	var decoded = jwt.verify(token, 'secret');
	mainUserId = decoded.data;
	next();
});

//RESEARCHER ROUTES

router.post('/researcher/alert', async (req, res) => {
	const userId = req.body.userId;
	if (userId == null) {
		res.status(412).json('Empty userId');
	}
	if (!alerts.includes(userId)) {
		alerts.push(userId);
		res.status(200).json('Added user ' + userId);
	} else {
		res.status(412).json('User is already alerted');
	}
});

router.get('/contacts', async (req, res) => {
	// const contacts = [{userId: 1, meeted: [2]}, {userId: 2, meeted: [1]}]
	res.json(contacts);
});

//USER ROUTES

//Store contact moment
router.post('/user/contact/', async (req, res) => {
	const userId = req.body.userId;
	const meetedUserId = req.body.meetedUserId;
	console.log(meetedUserId);
	console.log('user ' + mainUserId + ' had contact with ' + meetedUserId);

	for (let index = 0; index < contacts.accounts; index++) {
		if (contacts[index].userId == mainUserId) {
			res.status(200).json({ message: 'succes' });
			console.log('succes');
		}
	}
});

//Get user alert
router.get('/user/alert', async (req, res) => {
	console.log('routerlert aangeroepen');
	for (let index = 0; index < alerts.length; index++) {
		if (alerts[index] == mainUserId) {
			res.json(true);
		} else {
			res.json(false);
		}
	}
});

//get user ggdAuthCode
router.get('/user/auth', async (req, res) => {
	console.log('router auth aangeroepen');
	for (let index = 0; index < accounts.length; index++) {
		if (accounts[index].userId == mainUserId) {
			console.log(accounts[index].ggdAuthCode);
			res.json(accounts[index].ggdAuthCode);
		} else {
			res.json('there is no code here');
		}
	}
});
module.exports = router;
