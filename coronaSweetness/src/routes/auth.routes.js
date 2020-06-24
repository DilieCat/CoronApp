const express = require('express');
const router = express.Router();
var jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');

let accounts = [
	{ userId: 1, username: 'A', password: 'test', userlevel: 1 },
	{ userId: 2, username: 'B', password: 'test', userlevel: 1 },
];

router.post('/login/', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	let token;

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
				{ expiresIn: '1h' }
			);

			console.log(username + ' logged in');
			res.status(200);
			res.send(token);
		} else {
			res.status(401);
		}
	}

});

module.exports = router;
