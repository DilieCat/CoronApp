const CLI = require('clui');
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const http = require('http');

module.exports = {
	getPersonalAccesToken(){
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
	},
	
};
