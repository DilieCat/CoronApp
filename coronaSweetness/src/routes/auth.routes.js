const express = require('express')
const router = express.Router()
var jwtDecode = require('jwt-decode')
const jwt = require('../jwt-helper')

let accounts = [{userId: 1, username: 'A', password: 'test', userlevel: 1}, {userId: 2, username: 'B', password: 'test', userlevel: 1}]

router.post('/login/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let token;

    for (let index = 0; index < accounts.length; index++) {
        if(accounts[index].username == username && accounts[index].password == password){
            token = jwt.encodeToken(accounts[index].userId);
        }
    }

    res.status(200).json({
        token: token
      });
})

module.exports = router