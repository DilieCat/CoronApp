const http = require('http');

module.exports = {
	getAlert: async () => {
		let dataEncoded = JSON.stringify({ userId: 1 });

		let options = {
			host: 'localhost',
			port: 3000,
			path: '/main/user/alert',
			method: 'GET',
			headers: {
				'Content-Length': Buffer.byteLength(dataEncoded),
				'Content-Type': 'application/json',
			},
		};

		const req = http.request(options, (res) => {
			//console.log('statusCode:', res.statusCode);
			//console.log('headers:', res.headers);

			res.on('data', (d) => {
				console.log('heb ik waarschijnlijk corona?', JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.write(dataEncoded);
		req.end();
	},
};
