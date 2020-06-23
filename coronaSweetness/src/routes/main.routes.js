const express = require('express');
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const router = express.Router();
let mainUserId = '';

//User A = 1, User B = 2

let contacts = [
	{ userId: 1, meeted: [2] },
	{ userId: 2, meeted: [] },
];
let alerts = [1];

//Check if user is authenticated
router.all('*', function (req, res, next) {
	console.log('tokenvalidator aangeroepen');
	assert(
		typeof req.headers['x-access-token'] == 'string',
		'token is not a string!'
	);

	token = req.header('X-Access-Token') || '';
	console.log('token = ' + token);
	var decoded = jwt.verify(token, 'secret');
	console.log(decoded);
	mainUserId = decoded.data;
	console.log(mainUserId);
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
	} else {
		res.status(412).json('User is already alerted');
	}

	res.status(200).json('Addes user ' + userId);
});

/*
router.get('/contacts', async (req, res) => {
   // const contacts = [{userId: 1, meeted: [2]}, {userId: 2, meeted: [1]}]
    res.json(contacts)
})
*/

//USER ROUTES

//Store contact moment
router.post('/user/contact/', async (req, res) => {
	const userId = req.body.userId;
	const meetedUserId = req.body.meetedUserId;

	for (let index = 0; index < contacts.length; index++) {
		if (contacts[index].userId == userId) {
			contacts[index].meeted.push(meetedUserId);
		}
	}
	res.status(200).json();
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

//User login

router.post('/user/contact/', async (req, res) => {
	const meetedUserId = req.body.meetedUserId;

	for (let index = 0; index < contacts.length; index++) {
		if (contacts[index].userId == mainUserId) {
			contacts[index].meeted.push(meetedUserId);
		}
	}
	res.status(200).json();
});

module.exports = router;
