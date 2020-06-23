const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('./lib/inquirer');
const https = require('https');
const auther = require('./lib/auther');
const alert = require('./lib/alert');
const axios = require('axios');

const options = {
	port: 3000,
	host: 'localhost',
	method: 'CONNECT',
};

console.log(
	chalk.yellow(figlet.textSync('CoronApp', { horizontalLayout: 'full' }))
);

const run = async () => {
	try {
		console.log('test token' + (await getPersonalAccesToken()));
		var token = await auther.getPersonalAccesToken();

		console.log(chalk.green('logged in!'));
		console.log(token);
		var ggdVisit = await alert.getAlert(1, token);
		//console.log(ggdVisit);
	} catch (err) {
		if (err) {
			switch (err.status) {
				case 401:
					console.log(
						chalk.red(
							"Couldn't log you in. Please provide correct credentials/token."
						)
					);
					break;
				case 422:
					console.log(chalk.red(''));
					break;
				default:
					console.log(chalk.red(err));
			}
		}
	}
};
run();

getPersonalAccesToken() {
	const credentials = await inquirer.askCoronAppCredentials();
	const status = new Spinner('Authenticating you, please wait...');

	status.start();

	let auth = {
		username: credentials.username,
		password: credentials.password
	};

	//console.log(auth);
	axios.post('localhost:3000/auth/login', {
		auth
	  })
	  .then((res) => {
		console.log(`statusCode: ${res.statusCode}`)
		console.log(res)
	  })
	  .catch((error) => {
		console.error(error)
	  });
}