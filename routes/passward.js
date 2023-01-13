const express = require('express');
const router = express.Router();

const passwardController = require('../controllers/forgetPassward');

router.post('/forgotPassward' , passwardController.forgetPassward);

router.use('/resetpassward/:id' , passwardController.resetPassward);

router.use('/updatepassward/:id', passwardController.updatePassward);

module.exports = router;