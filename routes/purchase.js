const express = require('express');
const router = express.Router();

const userAuthentication = require('../middleware/auth');
const purchaseController = require('../controllers/purchase');

router.get('/prmiumMembership' , userAuthentication.authenticate , purchaseController.premiumMembership);

router.post('/udateTransection' , userAuthentication.authenticate , purchaseController.updateTransection);


module.exports = router;