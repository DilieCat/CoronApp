const express = require('express');
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const router = express.Router();
let db = require('../db')
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
    checkIfResearcher(res, userLevel)

    const requestedUserFirstname = req.body.requestedUserFirstname;
    const requestedUserLastname = req.body.requestedUserLastname;

    let requestedUser;

    for (let index = 0; index < db.accounts.length; index++) {
        if(db.accounts[index].firstname == requestedUserFirstname && db.accounts[index].lastname == requestedUserLastname){
            requestedUser = db.accounts[index].userId
        }    
    }

	if (requestedUser == null) {
		res.status(412).json('No person found');
	}
	if (!db.alerts.includes(requestedUser)) {
		db.alerts.push(requestedUser);
		res.status(200).json('Alerted user ' + requestedUserFirstname + ' ' + requestedUserLastname + ' he/she will show up soon');
	} else {
		res.status(412).json('User is already alerted');
	}
});

//Get contacts moments from user.
router.get('/researcher/contacts', async (req, res) => {
    checkIfResearcher(res, userLevel)

    const requestedUserFirstname = req.body.requestedUserFirstname;
    const requestedUserLastname = req.body.requestedUserLastname;

    let requestedUser;
    let userList = [];

    for (let index = 0; index < db.accounts.length; index++) {
        if(db.accounts[index].firstname == requestedUserFirstname && db.accounts[index].lastname == requestedUserLastname){
            requestedUser = db.accounts[index].userId
        }    
    }

    for (let index = 0; index < db.contacts.length; index++) {
        if(db.contacts[index].userId == requestedUser){
            for (let cindex = 0; cindex < db.contacts[index].meeted.length; cindex++) {
                for (let uindex = 0; uindex < db.accounts.length; uindex++) {
                    if(db.accounts[uindex].userId == db.contacts[index].meeted[cindex]){
                        userList.push(db.accounts[uindex])
                    }                    
                }
            }
        }
    }
    
    if(userList.length > 0){
        res.status(200).json(userList)
    } else {
        res.status(200).json({message: "No user or contact moments found."})
    }

})



//USER ROUTES

//Store contact moment
router.post('/user/contact/', async (req, res) => {
	const userId = req.body.userId;
	const meetedUserId = req.body.meetedUserId;
	console.log(meetedUserId);
	console.log('user ' + mainUserId + ' had contact with ' + meetedUserId);

	for (let index = 0; index < db.contacts.length; index++) {
		if (db.contacts[index].userId == mainUserId) {
			db.contacts[index].meeted.push(meetedUserId);
			res.status(200).json({ message: 'succes' });
			console.log('succes');
			console.log(db.contacts);
		}
	}
});

//Get user alert
router.get('/user/alert', async (req, res) => {
	console.log('routerlert aangeroepen');
	for (let index = 0; index < db.alerts.length; index++) {
		if (db.alerts[index] == mainUserId) {
			res.json(true);
		} else {
			res.json(false);
		}
	}
});

function checkIfResearcher(res, user){
    if(user != 2){
        res.status(403).json({message: "User not authorized for this action"})
    }
}

//User login

module.exports = router;
