const express = require('express');

const router = express.Router();

const premiumController = require('../controllers/premium')

router.get('/show-leaderBoard', premiumController.getAllExpence);

module.exports = router;