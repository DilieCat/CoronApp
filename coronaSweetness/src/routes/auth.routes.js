const express = require('express');
const router = express.Router();
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');

let accounts = [
	{
		userId: 1,
		username: 'A',
		password: 'test',
		userlevel: 1,
		ggdAuthCode: 'yeet',
	},
	{ userId: 2, username: 'B', password: 'test', userlevel: 1 },
	{ userId: 3, username: 'GGD', password: 'test', userlevel: 2 },
];

router.post('/login/', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	let token;
	let found;

	for (let index = 0; index < accounts.length; index++) {
		if (
			accounts[index].username == username &&
			accounts[index].password == password
		) {
			token = jwt.sign(
				{
					data: accounts[index].userId,
				},
				'secret',
				{ expiresIn: '1h' },
				{ userLevel: accounts[index].userlevel }
			);

			console.log(username + ' logged in');
			found = true;
		}
	}

	try {
		if (found) {
			res
				.status(200)
				.json({ message: 'User logged in succesfully', token: token });
		} else {
			res.status(401).json('Username or/and password dit not match.');
		}
	} catch (error) {
		console.log(error);
		return;
	}
});

module.exports = router;
