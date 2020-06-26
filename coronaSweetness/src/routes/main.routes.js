const express = require('express');
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const router = express.Router();
let db = require('../db');
let mainUserId = '';
let userLevel = '';

//User A = 1, User B = 2

//Check if user is authenticated
router.all('*', function (req, res, next) {
	assert(
		typeof req.headers['x-access-token'] == 'string',
		'token is not a string!'
	);

	token = req.header('X-Access-Token') || '';
	var decoded = jwt.verify(token, 'secret');
	mainUserId = decoded.data;
	userLevel = decoded.userLevel;
	next();
});

//RESEARCHER ROUTES
//
router.post('/researcher/alert', async (req, res) => {
	checkIfResearcher(res, userLevel);

	const requestedUserFirstname = req.body.requestedUserFirstname;
	const requestedUserLastname = req.body.requestedUserLastname;

	let requestedUser;

	for (let index = 0; index < db.accounts.length; index++) {
		if (
			db.accounts[index].firstname == requestedUserFirstname &&
			db.accounts[index].lastname == requestedUserLastname
		) {
			requestedUser = db.accounts[index].userId;
		}
	}

	if (requestedUser == null) {
		res.status(412).json('No person found');
	}
	if (!db.alerts.includes(requestedUser)) {
		db.alerts.push(requestedUser);
		res
			.status(200)
			.json(
				'Alerted user ' +
					requestedUserFirstname +
					' ' +
					requestedUserLastname +
					' he/she will show up soon'
			);
	} else {
		res.status(412).json('User is already alerted');
	}
});

//Get contacts moments from user.
router.get('/researcher/contacts', async (req, res) => {
	checkIfResearcher(res, userLevel);

	const requestedUserFirstname = req.body.requestedUserFirstname;
	const requestedUserLastname = req.body.requestedUserLastname;

	let requestedUser;
	let userList = [];

	for (let index = 0; index < db.accounts.length; index++) {
		if (
			db.accounts[index].firstname == requestedUserFirstname &&
			db.accounts[index].lastname == requestedUserLastname
		) {
			requestedUser = db.accounts[index].userId;
		}
	}

	for (let index = 0; index < db.contacts.length; index++) {
		if (db.contacts[index].userId == requestedUser) {
			for (
				let cindex = 0;
				cindex < db.contacts[index].meeted.length;
				cindex++
			) {
				for (let uindex = 0; uindex < db.accounts.length; uindex++) {
					if (db.accounts[uindex].userId == db.contacts[index].meeted[cindex]) {
						userList.push(db.accounts[uindex]);
					}
				}
			}
		}
	}
	if (userList.length > 0) {
		res.status(200).json(userList);
	} else {
		res.status(200).json({ message: 'No user or contact moments found.' });
	}
});

router.get('/researcher/userinfo', async (req, res) => {
	checkIfResearcher(res, userLevel);

	const requestedUserId = req.body.requestedUserId;

	for (let index = 0; index < db.accounts.length; index++) {
		if (db.accounts[index].userId == requestedUserId) {
			requestedUser = db.accounts[index];
			res.status(200).json({
				requestedUser,
			});
		}
	}
});

router.post('/researcher/auth', async (req, res) => {
	const userId = req.body.userId.userId;
	const authCode = req.body.authCode;
	//console.log(userId, authCode);
	for (let index = 0; index < db.accounts.length; index++) {
		//console.log(userId + ' ' + db.accounts[index].userId);
		if (db.accounts[index].userId == userId) {
			db.accounts[index].ggdAuthCode = authCode;
			res.status(200).json({
				message:
					'code: ' +
					db.accounts[index].ggdAuthCode +
					'set on account: ' +
					userId,
			});
		} else {
			//res.json('there is no code here');
		}
	}
});

//USER ROUTES

//Store contact moment
router.post('/user/contact/', async (req, res) => {
	const userId = req.body.userId;
	const meetedUserId = req.body.meetedUserId;

	for (let index = 0; index < db.contacts.length; index++) {
		if (db.contacts[index].userId == mainUserId) {
			db.contacts[index].meeted.push(meetedUserId);
			res.status(200).json({ message: 'succes' });
		}
	}
});

//Get user alert
router.get('/user/alert', async (req, res) => {
	for (let index = 0; index < db.alerts.length; index++) {
		if (db.alerts[index] == mainUserId) {
			res.status(200).json(true);
		} else {
			res.status(200).json(false);
		}
	}
});

router.get('/user/auth', async (req, res) => {
	console.log('routerUserAuth aangeroepen');
	for (let index = 0; index < db.accounts.length; index++) {
		//console.log(mainUserId + '\n');
		if (db.accounts[index].userId == mainUserId) {
			console.log('aight gevonden');
			res.status(200).json(db.accounts[index].ggdAuthCode);
		} else {
			res.status(404).json('niet gevonden bro');
		}
	}
});

function checkIfResearcher(res, user) {
	if (user != 2) {
		res.status(403).json({ message: 'User not authorized for this action' });
	}
}

//User login

module.exports = router;
