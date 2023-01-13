const express = require('express');
const router = express.Router();

const passwardController = require('../controllers/forgetPassward');

router.post('/forgotPassward' , passwardController.forgetPassward);

module.exports = router;