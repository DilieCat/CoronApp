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

const login = async () => {
	const token = await auther.getPersonalAccesToken();
	console.log(token);
};

const alertCheck = async () => {
	const boolean = await alert.getAlert();
	console.log(boolean);
};

console.log(
	chalk.yellow(figlet.textSync('CoronApp', { horizontalLayout: 'full' }))
);
alertCheck();
//login();
