const bcrypt = require("bcryptjs");

const saltRounds = 10;

const hash1 = bcrypt.hashSync('a', saltRounds);
const hash2 = bcrypt.hashSync('b', saltRounds);
const hash3 = bcrypt.hashSync('ggd', saltRounds);

let db = {
	accounts: [
		{
			userId: 1,
			username: 'A',
			password: hash1,
			firstname: 'A',
			lastname: 'koos',
			userlevel: 1,
			ggdAuthCode: '',
		},
		{
			userId: 2,
			username: 'B',
			password: hash2,
			firstname: 'B',
			lastname: 'kaas',
			userlevel: 1,
			ggdAuthCode: '',
		},
		{
			userId: 3,
			username: 'GGD',
			password: hash3,
			firstname: 'Pieter',
			lastname: 'Balke-Ende',
			userlevel: 2,
		},
	],
	contacts: [
		{ userId: 1, meeted: [2] },
		{ userId: 2, meeted: [] },
	],
	alerts: [1],
};

module.exports = db;
