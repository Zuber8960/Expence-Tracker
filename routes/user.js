const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const userAuthentication = require('../middleware/auth');

router.post('/sign-up',userController.signUp);

router.post('/login', userController.login);


router.get('/download', userAuthentication.authenticate , userController.download);

module.exports = router;