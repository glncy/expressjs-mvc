// Method Exporter
const exporter = require('./exporter');

// Import Middlewares Here
const Auth = require('./Auth');
module.exports = {
    Auth: exporter(Auth)
}