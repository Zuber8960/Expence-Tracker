const express = require('express');

const router = express.Router();

const expenceController = require('../controllers/expence');

router.post('/add-expence', expenceController.addExpence);

router.get('/get-expence', expenceController.getExpence);

router.post('/delete-expence/:id', expenceController.deleteExpence);

module.exports = router;