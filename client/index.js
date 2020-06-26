const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');
const figlet = require('figlet');
var inquirer = require('inquirer');
const axios = require('axios');
const alert = require('./lib/alert');
const request = require('request');
const fs = require('fs');
let privateToken;

console.log(
	chalk.yellow(figlet.textSync('CoronApp', { horizontalLayout: 'full' }))
);

async function showMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'menu',
				message: 'Keuze menu',
				choices: ['Verificatie code opvragen.', 'Contact gehad met persoon'],
			},
		])
		.then(async (answers) => {
			switch (answers['menu']) {
				case 'Contact gehad met persoon':
					await postMeetedUser();
					break;
				case 'Verificatie code opvragen.':
					await getAuthCode();
					break;
				default:
					break;
			}
			console.log('\n');
			setTimeout(function () {
				showMenu();
			}, 20);
		});
}

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

async function logIn(credentials) {
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
					console.log(chalk.green('logged in!'));
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

async function getAlert() {
	request.get(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/user/alert',
			headers: { 'X-Access-Token': privateToken },
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt get the status of ggdAlert \n'));
				return;
			} else {
				if (body) {
					console.log(
						chalk.green(
							'A GGD Researcher requested you to go to the GGD building. \n'
						)
					);
					showMenu();
				}
			}
		}
	);
}
async function postMeetedUser() {
	meetedUserId = await askContact();

	request.get(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/user/auth',
			headers: { 'X-Access-Token': privateToken },
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt post contact moment'));
				return;
			} else if (res.statusCode === 200) {
				console.log('Succesfully added contact moment with user.');
			}
		}
	);
}
function getAuthCode() {
	request.get(
		{
			ca: fs.readFileSync('cert/ca-crt.pem'),
			url: 'https://localhost:3000/main/user/auth',
			headers: { 'X-Access-Token': privateToken },
		},
		(error, res, body) => {
			if (error) {
				console.error(error);
				console.log(chalk.red('Couldnt get the auth code'));
				return;
			} else {
				console.log(body)
				if(res.statusCode == 404){
					console.log(chalk.red(body + ' \n'));
				} else {
					console.log(chalk.yellow('Your verification code is: ' + body + '\n'));
				}
				return body;
			}
		}
	);
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
						privateToken = body.token;
						console.log(chalk.green('logged in! \n'));
						getAlert();
					} else {
						console.log(chalk.red(body));
					}
				}
			}
		);
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
