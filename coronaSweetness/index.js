const app = require('./server');
 app.on('databaseConnected', function () {
    const port = 3000

    app.listen(port, () => {
        console.log(`server is listening on port ${port}`)
 })})