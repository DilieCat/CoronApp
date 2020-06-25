let db = { 
    accounts : [
	{ userId: 1, username: 'A', password: 'test', firstname: 'A', lastname: 'koos', userlevel: 1 },
	{ userId: 2, username: 'B', password: 'test', firstname: 'B', lastname: 'kaas', userlevel: 1 },
	{ userId: 3, username: 'GGD', password: 'test', firstname: 'Pieter', lastname: 'Balke-Ende', userlevel: 2 },
], contacts : [{userId: 1, meeted: [2]}, {userId: 2, meeted: []}],
    alerts : [1]

}

module.exports = db;