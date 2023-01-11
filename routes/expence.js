const express = require('express');

const router = express.Router();

const expenceController = require('../controllers/expence');

const userAuthentication = require('../middleware/auth');

router.post('/add-expence', userAuthentication.authenticate , expenceController.addExpence);

router.get('/get-expence', userAuthentication.authenticate , expenceController.getExpence);

router.post('/delete-expence/:id', userAuthentication.authenticate  ,expenceController.deleteExpence);

module.exports = router;


