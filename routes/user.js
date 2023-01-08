const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const expenceController = require('../controllers/expence');

router.post('/sign-up',userController.signUp);

router.post('/login', userController.login);

module.exports = router;