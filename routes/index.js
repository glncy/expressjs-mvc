var express = require('express');
var router = express.Router();
var controllers = require('./../controllers');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// LOGIN
router.get('/login', csrfProtection, controllers.Login.view);
router.post('/login', csrfProtection, controllers.Login.process);

module.exports = router;
