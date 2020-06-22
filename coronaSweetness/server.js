const express = require('express')
const app = express()
var cors = require('cors');

const mainRoutes = require('./src/routes/main.routes');
const authRoutes = require('./src/routes/auth.routes');

app.listen(process.env.PORT || 3000, () => console.log('server started'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors(process.env.PORT || 3000));


    
app.use('/main', mainRoutes);
app.use('/auth', authRoutes);

/*
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});*/

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

module.exports = app;