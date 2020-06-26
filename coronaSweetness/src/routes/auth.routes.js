const express = require('express');
const router = express.Router();
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
let db = require('../db')
const bcrypt = require("bcryptjs");



router.post('/login/', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	let token;
	let found;

	for (let index = 0; index < db.accounts.length; index++) {
		if (
			db.accounts[index].username == username &&
			bcrypt.compareSync(req.body.password, db.accounts[index].password)
		) {
			token = jwt.sign(
				{
					data: db.accounts[index].userId,
					userLevel: db.accounts[index].userlevel

				},
				'secret',
				{ expiresIn: '1h' },
			);

			console.log(username + ' logged in');
			found = true;
		} 

	}

	try {
		if(found){
			res.status(200).json({message: "User logged in succesfully", token: token});
		} else {
			res.status(401).json("Username or/and password dit not match.");
		}
	} catch (error) {
		console.log(error)
		return
	}
});

router.post('/loginResearcher/', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	let token;
	let found;
	let userLevel;

	for (let index = 0; index < db.accounts.length; index++) {
		if (
			db.accounts[index].username == username &&
			db.accounts[index].password == password
		) {
			token = jwt.sign(
				{
					data: db.accounts[index].userId,
					userLevel: db.accounts[index].userlevel

				},
				'secret',
				{ expiresIn: '1h' },
			);

			console.log(username + ' logged in');
			userLevel = db.accounts[index].userlevel
			found = true;
		} 

	}

	try {
	if(userLevel > 1){
		if(found){
			res.status(200).json({message: "User logged in succesfully", token: token});
		} else {
			res.status(401).json("Username or/and password dit not match.");
		}

	} else {
		res.status(403).json("This account is not authorized to use the GGD Researcher app.");
	}
	} catch (error) {
		console.log(error)
		return
	}
});

module.exports = router;
