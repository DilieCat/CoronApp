const CLI = require('clui');
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const http = require('http');

module.exports = {
	getPersonalAccesToken: async () => {
		const credentials = await inquirer.askCoronAppCredentials();
		const status = new Spinner('Authenticating you, please wait...');

		status.start();

		const auth = {
			username: credentials.username,
			password: credentials.password,
		};
		console.log(auth);
		let dataEncoded = JSON.stringify(auth);
		console.log(dataEncoded);

		let options = {
			host: 'localhost',
			port: 3000,
			path: '/auth/login',
			method: 'POST',
			headers: {
				'Content-Length': Buffer.byteLength(dataEncoded),
				'Content-Type': 'application/json',
			},
		};

		const req = http.request(options, (res) => {
			//console.log('statusCode:', res.statusCode);
			//console.log('headers:', res.headers);

			res.on('data', (d) => {
				//console.log(d);
				const token = d.toString('utf8');
				var n = token.includes(token);
				console.log(n);
				if (n == true) {
					//console.log(token);
					status.stop();
					return token;
				}
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.write(dataEncoded);
		req.end();
	},
};
