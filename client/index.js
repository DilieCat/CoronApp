const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');
const figlet = require('figlet');
var inquirer = require('inquirer');
const axios = require('axios');
const alert = require('./lib/alert');
const request = require('request');
const fs = require('fs');

console.log(
	chalk.yellow(figlet.textSync('CoronApp', { horizontalLayout: 'full' }))
);

function askCoronAppCredentials() {
	const questions = [
		{
			name: 'username',
			type: 'input',
			message: 'Enter your CoronApp username:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter your username or e-mail address.';
				}
			},
		},
		{
			name: 'password',
			type: 'password',
			message: 'Enter your password:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter your password.';
				}
			},
		},
	];
	return inquirer.prompt(questions);
}
function askContact() {
	const questions = [
		{
			name: 'meetedUserId',
			type: 'input',
			message: 'who did you contact?',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter a UserId';
				}
			},
		},
	];
	return inquirer.prompt(questions);
}

let privateToken;
function logIn(credentials) {
	request.post(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/auth/login',
			json: {
				username: credentials.username,
				password: credentials.password,
			},
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(
					chalk.red(
						"Couldn't log you in. Please provide correct credentials/token."
					)
				);
				return;
			} else {
				if (res.statusCode == 200) {
					privateToken = body.token;
					console.log(privateToken);
					console.log(chalk.green('logged in!'));
					getAlert(privateToken);
				} else {
					console.log(
						chalk.red(
							"Couldn't log you in. Please provide correct credentials/token."
						)
					);
				}
			}
		}
	);
}

function getAlert(privateToken) {
	console.log(privateToken);
	request.get(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/user/alert',
			headers: { 'X-Access-Token': privateToken },
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt get the status of ggdAlert'));
				return;
			} else {
				console.log('go to GGD: ' + body);
				return body;
			}
		}
	);
}
function postMeetedUser(meetedUserId) {
	console.log(meetedUserId.meetedUserId);

	request.post(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/user/contact',
			headers: { 'X-Access-Token': privateToken },
			json: {
				meetedUserId: meetedUserId.meetedUserId,
			},
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt post contact moment'));
				return;
			} else if (res.statusCode === 200) {
				console.log('succesfully added contact moment');
			}
		}
	);
}

const run = async () => {
	try {
		const credentials = await askCoronAppCredentials();
		await logIn(credentials);

		const meetedUserId = await askContact();
		await postMeetedUser(meetedUserId);
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
