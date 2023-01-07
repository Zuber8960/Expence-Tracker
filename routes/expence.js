const express = require('express');

const router = express.Router();

const expenceController = require('../controllers/expence');

router.post('/sign-up',expenceController.signUp);

router.post('/login', expenceController.login);

module.exports = router;