const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');
const figlet = require('figlet');
var inquirer = require('inquirer');
const axios = require('axios');
const alert = require('./lib/alert');
const request = require('request');
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

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

function showMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'menu',
				message: 'Keuze menu',
				choices: [
					'Alert gebruiker',
					'crocodile',
					'Alert gebruiker',
					'crocodile',
					'Alert gebruiker',
					'crocodile',
				],
			},
		])
		.then((answers) => {
			switch (answers) {
				case 'Alert gebruiker':
					console.log('test');
					break;

				default:
					break;
			}
		});
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
function verifyUser(privateToken) {
	const securityString = cryptoRandomString({ length: 10, type: 'base64' });
	request.post({
		ca: fs.readFileSync('cert/ca-crt.pem'),
		url: 'https://localhost:3000/main/researcher/auth',
		headers: { 'X-Access-Token': privateToken },
		json: {
			authCode: securityString,
		},
	});
	const question = [
		{
			name: 'verification',
			type: 'input',
			message: 'Enter your CoronApp verification code:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the code.';
				}
			},
		},
	];
	var UserString = inquirer.prompt(questions);
	if (securityString === UserString.verification) {
		console.log('user verified');
	}
}
const run = async () => {
	try {
		const credentials = await askCoronAppCredentials();

		const token = await request.post(
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
						console.log(body);
						console.log(chalk.green('logged in!'));
						showMenu();
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

		/*
			.then((res) => {
				return res.data;
				console.log(chalk.green('logged in!'));
			})
			.catch((error) => {
				console.error(error);
				console.log(
					chalk.red(
						"Couldn't log you in. Please provide correct credentials/token."
					)
				);
			});*/
		/*
		//console.log(token);
		var ggdVisit = await axios({
			method: 'GET',
			url: 'https://localhost:3000/main/user/alert',

			headers: { 'X-Access-Token': token },
		});
		console.log('Do i have to visit the GGD? ' + ggdVisit.data);

		const meetedUserId = await askContact();
		console.log(meetedUserId);
		await axios({
			method: 'POST',
			url: 'http://localhost:3000/main/user/contact',
			data: meetedUserId,
			headers: { 'X-Access-Token': token },
		}).then(function (response) {
			console.log(response.status);
		});*/
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
