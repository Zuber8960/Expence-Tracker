const express = require('express');

const router = express.Router();

const expenceController = require('../controllers/expence');

router.post('/sign-up',expenceController.signUp);

module.exports = router;