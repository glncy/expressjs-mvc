// Method Exporter
const exporter = require('./exporter');

// Import Controller Class Here
const Login = require('./auth/Login');

module.exports = {
    Login: exporter(Login)
}