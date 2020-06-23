const express = require('express')
const app = express()
var cors = require('cors');
var http = require('http');
var https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
var privateKey  = fs.readFileSync('cert/server-key.pem')
var certificate = fs.readFileSync('cert/server-crt.pem')
var ca = fs.readFileSync('cert/ca-crt.pem')

var credentials = {key: privateKey, cert: certificate, ca: ca};

const mainRoutes = require('./src/routes/main.routes');
const authRoutes = require('./src/routes/auth.routes');
/*
app.listen(process.env.PORT || 3000, () => console.log('server started'));



app.use(cors(process.env.PORT || 3000));





app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

var httpsServer = https.createServer(credentials, app);
*/
app.use(bodyParser.json());

app.use('/main', mainRoutes);
app.use('/auth', authRoutes);

http.createServer(app).listen(300)
https.createServer(credentials, app).listen(3000)


module.exports = app;
