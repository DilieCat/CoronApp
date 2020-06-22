const CLI = require('clui');
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const https = require('https');

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
			path: '/main/user/login',
			method: 'POST',
			headers: {
				'Content-Length': Buffer.byteLength(dataEncoded),
				'Content-Type': 'application/json',
			},
		};

		const req = https.request(options, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			res.on('data', (d) => {
				process.stdout.write(d);
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.write(dataEncoded);
		req.end();
	},
};
