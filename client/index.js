const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('./lib/inquirer');
const https = require('https');
const auther = require('./lib/auther');
const alert = require('./lib/alert');
var goToGGD = false;

const options = {
	port: 3000,
	host: 'localhost',
	method: 'CONNECT',
};

const alertCheck = async () => {
	const boolean = await alert.getAlert();
	console.log(boolean);
};

console.log(
	chalk.yellow(figlet.textSync('CoronApp', { horizontalLayout: 'full' }))
);

const run = async () => {
	try {
		const token = await auther.getPersonalAccesToken();
		console.log(chalk.green('logged in!'));
		console.log(token);
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
