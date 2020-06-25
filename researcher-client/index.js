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
let privateToken;
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

async function getContacts() {
	const questions = [
		{
			name: 'firstname',
			type: 'input',
			message: 'Enter the persons first name:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the persons first name.';
				}
			},
		},
		{
			name: 'lastname',
			type: 'input',
			message: 'Enter the persons lastname:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the persons lastname.';
				}
			},
		},
	];
	let answers = await inquirer.prompt(questions);

	request.get(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/researcher/contacts',
			headers: { 'X-Access-Token': privateToken },
			json: {
				requestedUserFirstname: answers.firstname,
				requestedUserLastname: answers.lastname,
			},
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt get contacts from the person'));
				return;
			} else if (res.statusCode === 200) {
				console.log(body);
			}
		}
	);
}

async function alertUser() {
	const questions = [
		{
			name: 'firstname',
			type: 'input',
			message: 'Enter the persons first name:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the persons first name.';
				}
			},
		},
		{
			name: 'lastname',
			type: 'input',
			message: 'Enter the persons lastname:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the persons lastname.';
				}
			},
		},
	];
	let answers = await inquirer.prompt(questions);

	request.post(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/researcher/alert',
			headers: { 'X-Access-Token': privateToken },
			json: {
				requestedUserFirstname: answers.firstname,
				requestedUserLastname: answers.lastname,
			},
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Not authorized or the server crashed.'));
				return;
			} else {
				console.log(body);
			}
		}
	);
}

function showMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'menu',
				message: 'Keuze menu',
				choices: [
					'Alert gebruiker om te melden bij de GGD',
					'Vraag contact momenten op',
					'Verifieër gebruiker',
					'crocodile',
					'Alert gebruiker',
					'crocodile',
				],
			},
		])
		.then((answers) => {
			switch (answers['menu']) {
				case 'Alert gebruiker om te melden bij de GGD':
					alertUser();
					break;

				case 'Vraag contact momenten op':
					getContacts();
					break;
				case 'Verifieër gebruiker':
					verifyUser();
					break;
				default:
					break;
			}
		});
}

async function verifyUser() {
	console.log('verifyUser aangeroepen!');
	const securityString = cryptoRandomString({ length: 10, type: 'base64' });
	console.log(securityString);
	const id = [
		{
			name: 'userId',
			type: 'input',
			message: 'Enter the userId',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter the code.';
				}
			},
		},
	];
	var UserId = await inquirer.prompt(id);
	if (UserId != null) {
		console.log('POST request klaarmaken');
		request.post({
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/researcher/auth',
			headers: { 'X-Access-Token': privateToken },
			json: { userId: UserId, authCode: securityString },
		});
	}
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
	var UserString = await inquirer.prompt(question);

	if (securityString === UserString.verification) {
		console.log('user verified');
	} else {
		console.log('fail.');
	}
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
const run = async () => {
	try {
		const credentials = await askCoronAppCredentials();

		const token = await request.post(
			{
				ca: fs.readFileSync('cert/ca-crt.pem'),
				url: 'https://localhost:3000/auth/loginResearcher',
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
						privateToken = body.token;
						console.log(chalk.green('logged in!'));
						showMenu();
					} else {
						console.log(chalk.red(body));
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
